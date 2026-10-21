import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE, normalizePhoneDigits } from '@artisancode/phone'
import ExcelJS from 'exceljs'

import type {
  CompanyType,
  CustomerImportDryRunResult,
  CustomerImportRow,
  ImportError,
  KeyPersonImportRow,
} from '@/entities/customer.entity'

import type { CustomerUsecaseDeps } from '../customer.usecase'

function getCellString(cell?: ExcelJS.Cell): string {
  if (!cell || cell.value === null || cell.value === undefined) return ''
  const val = cell.value
  if (typeof val === 'string') return val.trim()
  if (typeof val === 'number' || typeof val === 'boolean') return String(val).trim()
  if (val instanceof Date) return val.toISOString().split('T')[0]
  if (typeof val === 'object') {
    if ('text' in val && typeof (val as { text: unknown }).text === 'string') {
      return (val as { text: string }).text.trim()
    }
    if ('result' in val && (val as { result: unknown }).result !== undefined) {
      return String((val as { result: unknown }).result).trim()
    }
    if ('richText' in val && Array.isArray((val as { richText: unknown[] }).richText)) {
      return (val as { richText: { text?: string }[] }).richText
        .map((t) => t.text || '')
        .join('')
        .trim()
    }
  }
  return String(val).trim()
}

function getCellDateString(cell?: ExcelJS.Cell): string | undefined {
  if (!cell || cell.value === null || cell.value === undefined) return undefined
  const val = cell.value
  if (val instanceof Date) {
    return val.toISOString().split('T')[0]
  }
  const str = getCellString(cell)
  if (!str) return undefined
  const parsed = new Date(str)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0]
  }
  return str
}

function getCellNumber(cell?: ExcelJS.Cell): number | undefined {
  if (!cell || cell.value === null || cell.value === undefined) return undefined
  const val = cell.value
  if (typeof val === 'number') return isNaN(val) ? undefined : val
  const str = getCellString(cell).replace(/[^0-9.-]+/g, '')
  if (!str) return undefined
  const parsed = Number(str)
  return isNaN(parsed) ? undefined : parsed
}

function getCellBoolean(cell?: ExcelJS.Cell): boolean {
  const str = getCellString(cell).toLowerCase()
  return str === 'ya' || str === 'yes' || str === 'true' || str === '1' || str === 'y'
}

const COUNTRY_CODE_OPTIONS = COUNTRY_CODES.map((c) => c.code)

// Blank = Indonesia (+62). Accepts "62" or "+62"; undefined = code not in the supported list.
function parseCountryCode(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return DEFAULT_COUNTRY_CODE
  return COUNTRY_CODE_OPTIONS.includes(digits) ? digits : undefined
}

function countryCodeError(
  sheet: 'Customer' | 'Key Person',
  row: number,
  field: string,
  value: string,
): ImportError {
  return {
    sheet,
    row,
    field,
    message: `Kode negara "${value}" tidak dikenal. Pilihan: ${COUNTRY_CODE_OPTIONS.join(', ')}`,
    value,
  }
}

function normalizeHeader(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function isRowCompletelyEmpty(row: ExcelJS.Row): boolean {
  let empty = true
  row.eachCell((cell) => {
    if (getCellString(cell).length > 0) {
      empty = false
    }
  })
  return empty
}

export async function dryRunImport(
  deps: CustomerUsecaseDeps,
  fileBuffer: Buffer | Uint8Array,
): Promise<CustomerImportDryRunResult> {
  const errors: ImportError[] = []
  const previewCustomers: CustomerImportRow[] = []
  const previewKeyPersons: KeyPersonImportRow[] = []

  const workbook = new ExcelJS.Workbook()
  const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer)
  // ponytail: exceljs's .d.ts declares its own unexported `Buffer extends
  // ArrayBuffer {}` local to that module, shadowing Node's Buffer only inside
  // its own types — so there's no nameable type here more specific than any.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await workbook.xlsx.load(buffer as any)

  const [categories, segmentations, areas] = await Promise.all([
    deps.categoryUsecase.findList({ group: 'category', pagination: { page: 1, per_page: 500 } }),
    deps.categoryUsecase.findList({
      group: 'segmentation',
      pagination: { page: 1, per_page: 500 },
    }),
    deps.categoryUsecase.findList({ group: 'area', pagination: { page: 1, per_page: 500 } }),
  ])

  const categoryMap = new Map<string, string>()
  const segmentationMap = new Map<string, string>()
  const areaMap = new Map<string, string>()

  for (const cat of categories.items) {
    if (cat.status === 'active') categoryMap.set(cat.name.trim().toLowerCase(), cat.id)
  }
  for (const seg of segmentations.items) {
    if (seg.status === 'active') segmentationMap.set(seg.name.trim().toLowerCase(), seg.id)
  }
  for (const area of areas.items) {
    if (area.status === 'active') areaMap.set(area.name.trim().toLowerCase(), area.id)
  }

  // -------------------------------------------------------------------------
  // 1. Process Sheet 1: Customer
  // -------------------------------------------------------------------------
  const customerSheet = workbook.getWorksheet('Data Customer') || workbook.worksheets[0]
  const seenCustomerNames = new Set<string>()
  let totalCustomers = 0

  if (!customerSheet) {
    errors.push({
      sheet: 'Customer',
      row: 1,
      field: 'Worksheet',
      message: 'Sheet "Data Customer" tidak ditemukan di file Excel',
    })
  } else {
    // Determine column indices from row 1 headers
    const custHeaderMap = new Map<string, number>()
    const headerRow = customerSheet.getRow(1)
    headerRow.eachCell((cell, colNumber) => {
      const norm = normalizeHeader(getCellString(cell))
      if (
        norm === 'namaperusahaan' ||
        norm === 'nama' ||
        norm === 'customer' ||
        norm === 'namacustomer'
      ) {
        custHeaderMap.set('name', colNumber)
      } else if (norm.includes('kategori') || norm.includes('sektor')) {
        custHeaderMap.set('categoryName', colNumber)
      } else if (norm.includes('segment')) {
        custHeaderMap.set('segmentationName', colNumber)
      } else if (norm.includes('area') || norm.includes('wilayah')) {
        custHeaderMap.set('areaName', colNumber)
      } else if (norm.includes('tipe')) {
        custHeaderMap.set('companyType', colNumber)
      } else if (norm === 'status') {
        custHeaderMap.set('status', colNumber)
      } else if (norm.includes('potensi')) {
        custHeaderMap.set('potential', colNumber)
      } else if (norm.includes('pernahkontrak') || norm.includes('riwayatkontrak')) {
        custHeaderMap.set('hasContractHistory', colNumber)
      } else if (norm.includes('tahunkontrak')) {
        custHeaderMap.set('lastContractYear', colNumber)
      } else if (norm.includes('pendapatan') || norm.includes('revenue')) {
        custHeaderMap.set('lastRevenue', colNumber)
      } else if (norm.includes('kodenegara')) {
        custHeaderMap.set(norm.includes('fax') ? 'faxCountryCode' : 'phoneCountryCode', colNumber)
      } else if (norm.includes('telepon') || norm.includes('telp') || norm === 'phone') {
        custHeaderMap.set('phone', colNumber)
      } else if (norm.includes('fax') || norm.includes('faks')) {
        custHeaderMap.set('fax', colNumber)
      } else if (norm.includes('alamat')) {
        custHeaderMap.set('address', colNumber)
      } else if (norm.includes('email')) {
        custHeaderMap.set('companyEmail', colNumber)
      } else if (norm.includes('website') || norm === 'web') {
        custHeaderMap.set('website', colNumber)
      } else if (norm === 'npwp') {
        custHeaderMap.set('npwp', colNumber)
      } else if (norm === 'skt') {
        custHeaderMap.set('skt', colNumber)
      } else if (norm.includes('catatan') || norm === 'notes') {
        custHeaderMap.set('notes', colNumber)
      }
    })

    const getCustCell = (row: ExcelJS.Row, key: string, fallbackCol: number) => {
      const col = custHeaderMap.get(key) ?? fallbackCol
      return row.getCell(col)
    }

    for (let rowNumber = 2; rowNumber <= customerSheet.rowCount; rowNumber++) {
      const row = customerSheet.getRow(rowNumber)
      if (isRowCompletelyEmpty(row)) continue

      totalCustomers++
      let hasRowError = false

      const rawName = getCellString(getCustCell(row, 'name', 1))
      if (!rawName) {
        errors.push({
          sheet: 'Customer',
          row: rowNumber,
          field: 'Nama Perusahaan',
          message: 'Nama perusahaan wajib diisi',
          value: '',
        })
        hasRowError = true
      }

      const lowerName = rawName.toLowerCase()
      if (rawName && seenCustomerNames.has(lowerName)) {
        errors.push({
          sheet: 'Customer',
          row: rowNumber,
          field: 'Nama Perusahaan',
          message: `Duplikat nama perusahaan "${rawName}" di sheet ini`,
          value: rawName,
        })
        hasRowError = true
      } else if (rawName) {
        seenCustomerNames.add(lowerName)
      }

      const rawCategory = getCellString(getCustCell(row, 'categoryName', 2))
      let categoryId: string | undefined
      if (rawCategory) {
        categoryId = categoryMap.get(rawCategory.toLowerCase())
        if (!categoryId) {
          errors.push({
            sheet: 'Customer',
            row: rowNumber,
            field: 'Kategori / Sektor',
            message: `Kategori "${rawCategory}" tidak terdaftar di sistem. Cek sheet Panduan & Master Data`,
            value: rawCategory,
          })
          hasRowError = true
        }
      }

      const rawSegmentation = getCellString(getCustCell(row, 'segmentationName', 3))
      let segmentationId: string | undefined
      if (rawSegmentation) {
        segmentationId = segmentationMap.get(rawSegmentation.toLowerCase())
        if (!segmentationId) {
          errors.push({
            sheet: 'Customer',
            row: rowNumber,
            field: 'Segmentasi',
            message: `Segmentasi "${rawSegmentation}" tidak terdaftar di sistem. Cek sheet Panduan & Master Data`,
            value: rawSegmentation,
          })
          hasRowError = true
        }
      }

      const rawArea = getCellString(getCustCell(row, 'areaName', 4))
      let areaId: string | undefined
      if (rawArea) {
        areaId = areaMap.get(rawArea.toLowerCase())
        if (!areaId) {
          errors.push({
            sheet: 'Customer',
            row: rowNumber,
            field: 'Area',
            message: `Area "${rawArea}" tidak terdaftar di sistem. Cek sheet Panduan & Master Data`,
            value: rawArea,
          })
          hasRowError = true
        }
      }

      const rawCompanyType = getCellString(getCustCell(row, 'companyType', 5))
      let companyType: CompanyType | undefined
      if (rawCompanyType) {
        const ct = rawCompanyType.toLowerCase()
        if (ct.includes('perorangan') || ct.includes('pribadi') || ct.includes('individu'))
          companyType = 'perorangan'
        else if (ct.includes('bumn')) companyType = 'bumn'
        else if (ct.includes('asing')) companyType = 'swasta_asing'
        else if (ct.includes('swasta') || ct.includes('nasional')) companyType = 'swasta_nasional'
      }

      const rawStatus = getCellString(getCustCell(row, 'status', 6)).toLowerCase()
      let status: 'prospect' | 'active' | 'inactive' = 'prospect'
      if (rawStatus.includes('aktif') && !rawStatus.includes('tidak')) status = 'active'
      else if (
        rawStatus.includes('tidak') ||
        rawStatus.includes('nonaktif') ||
        rawStatus === 'inactive'
      )
        status = 'inactive'
      else if (rawStatus.includes('prospek') || rawStatus === 'prospect') status = 'prospect'

      const rawPotential = getCellString(getCustCell(row, 'potential', 7)).toLowerCase()
      let potential: 'high' | 'medium' | 'low' = 'medium'
      if (rawPotential.includes('tinggi') || rawPotential === 'high') potential = 'high'
      else if (rawPotential.includes('rendah') || rawPotential === 'low') potential = 'low'
      else if (rawPotential.includes('sedang') || rawPotential === 'medium') potential = 'medium'

      const hasContractHistory = getCellBoolean(getCustCell(row, 'hasContractHistory', 8))
      const lastContractYear = getCellNumber(getCustCell(row, 'lastContractYear', 9))
      const lastRevenue = getCellNumber(getCustCell(row, 'lastRevenue', 10))
      const address = getCellString(getCustCell(row, 'address', 11)) || undefined
      const companyEmail = getCellString(getCustCell(row, 'companyEmail', 12)) || undefined
      // phone/fax are stored as local digits (no trunk 0) + their own country code
      const rawPhoneCc = getCellString(getCustCell(row, 'phoneCountryCode', 14))
      const rawFaxCc = getCellString(getCustCell(row, 'faxCountryCode', 16))
      const phoneCc = parseCountryCode(rawPhoneCc)
      const faxCc = parseCountryCode(rawFaxCc)
      if (phoneCc === undefined) {
        errors.push(countryCodeError('Customer', rowNumber, 'Kode Negara Telepon', rawPhoneCc))
        hasRowError = true
      }
      if (faxCc === undefined) {
        errors.push(countryCodeError('Customer', rowNumber, 'Kode Negara Fax', rawFaxCc))
        hasRowError = true
      }
      const phone =
        normalizePhoneDigits(getCellString(getCustCell(row, 'phone', 13)), phoneCc) || undefined
      const fax =
        normalizePhoneDigits(getCellString(getCustCell(row, 'fax', 15)), faxCc) || undefined
      const website = getCellString(getCustCell(row, 'website', 17)) || undefined
      const npwp = getCellString(getCustCell(row, 'npwp', 18)) || undefined
      const skt = getCellString(getCustCell(row, 'skt', 19)) || undefined
      const notes = getCellString(getCustCell(row, 'notes', 20)) || undefined

      if (!hasRowError && rawName) {
        previewCustomers.push({
          rowNumber,
          name: rawName,
          categoryName: rawCategory || undefined,
          categoryId,
          segmentationName: rawSegmentation || undefined,
          segmentationId,
          areaName: rawArea || undefined,
          areaId,
          companyType,
          status,
          potential,
          hasContractHistory,
          lastContractYear: lastContractYear ? Math.floor(lastContractYear) : undefined,
          lastRevenue,
          address,
          companyEmail,
          phone,
          phoneCountryCode: phoneCc,
          fax,
          faxCountryCode: faxCc,
          website,
          npwp,
          skt,
          notes,
        })
      }
    }
  }

  // -------------------------------------------------------------------------
  // 2. Process Sheet 2: Key Person
  // -------------------------------------------------------------------------
  const contactSheet = workbook.getWorksheet('Data Key Person') || workbook.worksheets[1]
  let totalKeyPersons = 0

  if (contactSheet) {
    const contactHeaderMap = new Map<string, number>()
    const kpHeaderRow = contactSheet.getRow(1)
    kpHeaderRow.eachCell((cell, colNumber) => {
      const norm = normalizeHeader(getCellString(cell))
      if (
        norm === 'namaperusahaan' ||
        norm === 'customer' ||
        norm === 'perusahaan' ||
        norm === 'namacustomer'
      ) {
        contactHeaderMap.set('customerName', colNumber)
      } else if (
        norm === 'namalengkappic' ||
        norm === 'namapic' ||
        norm === 'pic' ||
        (norm.includes('nama') &&
          !norm.includes('anak') &&
          !norm.includes('pasangan') &&
          !norm.includes('perusahaan'))
      ) {
        contactHeaderMap.set('name', colNumber)
      } else if (norm.includes('jabatan') || norm.includes('posisi')) {
        contactHeaderMap.set('position', colNumber)
      } else if (norm.includes('kodenegara')) {
        contactHeaderMap.set(
          norm.includes('whatsapp') ? 'countryCode' : 'landlineCountryCode',
          colNumber,
        )
      } else if (
        norm.includes('tetap') ||
        norm.includes('landline') ||
        norm.includes('pstn') ||
        norm.includes('teleponkantor')
      ) {
        contactHeaderMap.set('landline', colNumber)
      } else if (
        norm.includes('wa') ||
        norm.includes('whatsapp') ||
        norm.includes('telepon') ||
        norm.includes('hp') ||
        norm.includes('phone')
      ) {
        contactHeaderMap.set('whatsapp', colNumber)
      } else if (norm.includes('email')) {
        contactHeaderMap.set('email', colNumber)
      } else if (norm.includes('penting') || norm.includes('utama') || norm.includes('primary')) {
        contactHeaderMap.set('isPrimary', colNumber)
      } else if (norm.includes('kelamin') || norm.includes('gender')) {
        contactHeaderMap.set('gender', colNumber)
      } else if (norm.includes('tempatlahir')) {
        contactHeaderMap.set('birthPlace', colNumber)
      } else if (
        norm.includes('tanggallahir') ||
        norm.includes('tgllahir') ||
        norm.includes('dob')
      ) {
        contactHeaderMap.set('dateOfBirth', colNumber)
      } else if (norm.includes('agama')) {
        contactHeaderMap.set('religion', colNumber)
      } else if (norm.includes('pendidikan')) {
        contactHeaderMap.set('education', colNumber)
      } else if (norm.includes('alamat')) {
        contactHeaderMap.set('address', colNumber)
      } else if (norm.includes('namapasangan')) {
        contactHeaderMap.set('spouseName', colNumber)
      } else if (norm.includes('pekerjaanpasangan')) {
        contactHeaderMap.set('spouseOccupation', colNumber)
      } else if (norm.includes('namaanak')) {
        contactHeaderMap.set('childrenNames', colNumber)
      } else if (norm.includes('pekerjaananak')) {
        contactHeaderMap.set('childrenOccupation', colNumber)
      } else if (norm.includes('profiling') || norm.includes('catatan')) {
        contactHeaderMap.set('profiling', colNumber)
      }
    })

    const getKpCell = (row: ExcelJS.Row, key: string, fallbackCol: number) => {
      const col = contactHeaderMap.get(key) ?? fallbackCol
      return row.getCell(col)
    }

    // Collect customer names mentioned in Key Person sheet that are not in Sheet 1
    const pendingDbLookupNames = new Set<string>()
    for (let rowNumber = 2; rowNumber <= contactSheet.rowCount; rowNumber++) {
      const row = contactSheet.getRow(rowNumber)
      if (isRowCompletelyEmpty(row)) continue
      const custName = getCellString(getKpCell(row, 'customerName', 1))
      if (custName && !seenCustomerNames.has(custName.toLowerCase())) {
        pendingDbLookupNames.add(custName.toLowerCase())
      }
    }

    // Query DB for customer names that weren't in Sheet 1
    const dbCustomerNames = new Set<string>()
    if (pendingDbLookupNames.size > 0) {
      const dbCusts = await deps.repo.findCustomersByNames(Array.from(pendingDbLookupNames))
      for (const c of dbCusts) {
        dbCustomerNames.add(c.name.trim().toLowerCase())
      }
    }

    for (let rowNumber = 2; rowNumber <= contactSheet.rowCount; rowNumber++) {
      const row = contactSheet.getRow(rowNumber)
      if (isRowCompletelyEmpty(row)) continue

      totalKeyPersons++
      let hasRowError = false

      const customerName = getCellString(getKpCell(row, 'customerName', 1))
      if (!customerName) {
        errors.push({
          sheet: 'Key Person',
          row: rowNumber,
          field: 'Nama Perusahaan',
          message: 'Nama perusahaan wajib diisi',
          value: '',
        })
        hasRowError = true
      } else {
        const lowerCust = customerName.toLowerCase()
        if (!seenCustomerNames.has(lowerCust) && !dbCustomerNames.has(lowerCust)) {
          errors.push({
            sheet: 'Key Person',
            row: rowNumber,
            field: 'Nama Perusahaan',
            message: `Perusahaan "${customerName}" tidak ditemukan di sheet Data Customer maupun di database`,
            value: customerName,
          })
          hasRowError = true
        }
      }

      const name = getCellString(getKpCell(row, 'name', 2))
      if (!name) {
        errors.push({
          sheet: 'Key Person',
          row: rowNumber,
          field: 'Nama Lengkap PIC',
          message: 'Nama PIC wajib diisi',
          value: '',
        })
        hasRowError = true
      }

      const rawWa = getCellString(getKpCell(row, 'whatsapp', 4))
      const rawLandline = getCellString(getKpCell(row, 'landline', 6))
      const rawWaCc = getCellString(getKpCell(row, 'countryCode', 5))
      const rawLandlineCc = getCellString(getKpCell(row, 'landlineCountryCode', 7))
      const waCc = parseCountryCode(rawWaCc)
      const landlineCc = parseCountryCode(rawLandlineCc)
      if (waCc === undefined) {
        errors.push(countryCodeError('Key Person', rowNumber, 'Kode Negara WhatsApp', rawWaCc))
        hasRowError = true
      }
      if (landlineCc === undefined) {
        errors.push(
          countryCodeError('Key Person', rowNumber, 'Kode Negara Telepon Tetap', rawLandlineCc),
        )
        hasRowError = true
      }
      let cleanWa = ''
      let cleanLandline = ''
      if (!rawWa && !rawLandline) {
        errors.push({
          sheet: 'Key Person',
          row: rowNumber,
          field: 'Nomor WhatsApp / Telepon Tetap',
          message: 'Isi minimal salah satu: Nomor WhatsApp atau Telepon Tetap',
          value: '',
        })
        hasRowError = true
      }
      if (rawWa) {
        cleanWa = normalizePhoneDigits(rawWa, waCc)
        if (cleanWa.length < 8 || cleanWa.length > 15) {
          errors.push({
            sheet: 'Key Person',
            row: rowNumber,
            field: 'Nomor WhatsApp',
            message: `Nomor WhatsApp tidak valid: "${rawWa}"`,
            value: rawWa,
          })
          hasRowError = true
        }
      }
      if (rawLandline) {
        // local digits without trunk 0 (country code is stored separately)
        cleanLandline = normalizePhoneDigits(rawLandline, landlineCc)
        if (cleanLandline.length < 6 || cleanLandline.length > 15) {
          errors.push({
            sheet: 'Key Person',
            row: rowNumber,
            field: 'Telepon Tetap',
            message: `Telepon tetap tidak valid: "${rawLandline}"`,
            value: rawLandline,
          })
          hasRowError = true
        }
      }

      const email = getCellString(getKpCell(row, 'email', 8)) || undefined
      if (email && (!email.includes('@') || !email.includes('.'))) {
        errors.push({
          sheet: 'Key Person',
          row: rowNumber,
          field: 'Email',
          message: `Format email tidak valid: "${email}"`,
          value: email,
        })
        hasRowError = true
      }

      const rawGender = getCellString(getKpCell(row, 'gender', 10)).toLowerCase()
      let gender: 'male' | 'female' | undefined
      if (
        rawGender.includes('laki') ||
        rawGender.includes('pria') ||
        rawGender === 'male' ||
        rawGender === 'l'
      ) {
        gender = 'male'
      } else if (
        rawGender.includes('perempuan') ||
        rawGender.includes('wanita') ||
        rawGender === 'female' ||
        rawGender === 'p'
      ) {
        gender = 'female'
      }

      const position = getCellString(getKpCell(row, 'position', 3)) || undefined
      const isPrimary = getCellBoolean(getKpCell(row, 'isPrimary', 9))
      const birthPlace = getCellString(getKpCell(row, 'birthPlace', 11)) || undefined
      const dateOfBirth = getCellDateString(getKpCell(row, 'dateOfBirth', 12))
      const religion = getCellString(getKpCell(row, 'religion', 13)) || undefined
      const education = getCellString(getKpCell(row, 'education', 14)) || undefined
      const address = getCellString(getKpCell(row, 'address', 15)) || undefined
      const spouseName = getCellString(getKpCell(row, 'spouseName', 16)) || undefined
      const spouseOccupation = getCellString(getKpCell(row, 'spouseOccupation', 17)) || undefined
      const childrenNames = getCellString(getKpCell(row, 'childrenNames', 18)) || undefined
      const childrenOccupation =
        getCellString(getKpCell(row, 'childrenOccupation', 19)) || undefined
      const profiling = getCellString(getKpCell(row, 'profiling', 20)) || undefined

      if (!hasRowError && customerName && name && (cleanWa || cleanLandline)) {
        previewKeyPersons.push({
          rowNumber,
          customerName,
          name,
          position,
          whatsapp: cleanWa || undefined,
          landline: cleanLandline || undefined,
          countryCode: waCc,
          landlineCountryCode: landlineCc,
          email,
          gender,
          isPrimary,
          birthPlace,
          dateOfBirth,
          religion,
          education,
          address,
          spouseName,
          spouseOccupation,
          childrenNames,
          childrenOccupation,
          profiling,
        })
      }
    }
  }

  return {
    totalCustomers,
    validCustomers: previewCustomers.length,
    totalKeyPersons,
    validKeyPersons: previewKeyPersons.length,
    errors,
    previewCustomers,
    previewKeyPersons,
  }
}
