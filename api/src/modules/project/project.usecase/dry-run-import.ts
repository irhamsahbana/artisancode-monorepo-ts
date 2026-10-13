import ExcelJS from 'exceljs'

import type {
  ProjectImportDryRunResult,
  ProjectImportError,
  ProjectImportRow,
  ProjectProductImportRow,
  ProjectStatus,
} from '@/entities/project.entity'

import type { ProjectUsecaseDeps } from '../project.usecase'

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

function getCellNumber(cell?: ExcelJS.Cell): number | undefined {
  if (!cell || cell.value === null || cell.value === undefined) return undefined
  const val = cell.value
  if (typeof val === 'number') return isNaN(val) ? undefined : val
  const str = getCellString(cell).replace(/[^0-9.-]+/g, '')
  if (!str) return undefined
  const parsed = Number(str)
  return isNaN(parsed) ? undefined : parsed
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

export function parseProjectStatus(val: string): ProjectStatus | null {
  const s = val.toLowerCase().trim()
  if (!s || s === 'prospek' || s === 'prospect') return 'prospect'
  if (s === 'sedang proses' || s === 'in_progress' || s === 'dalam proses' || s === 'berjalan') {
    return 'in_progress'
  }
  if (s === 'berhasil' || s === 'won' || s === 'menang' || s === 'selesai') return 'won'
  if (s === 'gagal' || s === 'lost' || s === 'kalah') return 'lost'
  return null
}

export async function dryRunImport(
  deps: ProjectUsecaseDeps,
  fileBuffer: Buffer | Uint8Array,
): Promise<ProjectImportDryRunResult> {
  const errors: ProjectImportError[] = []
  const previewProjects: ProjectImportRow[] = []
  const previewProducts: ProjectProductImportRow[] = []

  const workbook = new ExcelJS.Workbook()
  const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await workbook.xlsx.load(buffer as any)

  // 1. Fetch active customers & products
  const [customersResult, productsResult] = await Promise.all([
    deps.customerRepo.findList({ pagination: { page: 1, per_page: 2000 } }),
    deps.productUsecase.findList({ isActive: true, pagination: { page: 1, per_page: 2000 } }),
  ])

  const customerMap = new Map<string, typeof customersResult.items[0]>()
  for (const c of customersResult.items) {
    customerMap.set(c.name.toLowerCase().trim(), c)
  }

  const productMap = new Map<string, typeof productsResult.items[0]>()
  for (const p of productsResult.items) {
    productMap.set(p.name.toLowerCase().trim(), p)
  }

  // 2. Identify Worksheets
  const projectSheet =
    workbook.getWorksheet('Data Proyek') ||
    workbook.worksheets.find((ws) => ws.name.toLowerCase().includes('proyek')) ||
    workbook.worksheets[0]

  const productSheet =
    workbook.getWorksheet('Kebutuhan Produk Proyek') ||
    workbook.worksheets.find((ws) => ws.name.toLowerCase().includes('produk'))

  if (!projectSheet) {
    errors.push({
      sheet: 'File Excel',
      row: 1,
      message: 'Sheet "Data Proyek" tidak ditemukan dalam file Excel.',
    })
    return {
      totalProjects: 0,
      validProjects: 0,
      totalProducts: 0,
      validProducts: 0,
      errors,
      previewProjects: [],
      previewProducts: [],
    }
  }

  // 3. Parse Sheet 1: Data Proyek
  const projHeaderMap = new Map<string, number>()
  const firstRow = projectSheet.getRow(1)
  firstRow.eachCell((cell, colNumber) => {
    const norm = normalizeHeader(getCellString(cell))
    if (norm) projHeaderMap.set(norm, colNumber)
  })

  // Detect header columns with aliases
  const getCol = (aliases: string[]): number | undefined => {
    for (const a of aliases) {
      const idx = projHeaderMap.get(normalizeHeader(a))
      if (idx !== undefined) return idx
    }
    return undefined
  }

  const colProjectNumber = getCol(['nomorproyek', 'kodeproyek', 'no_proyek', 'nomerproyek'])
  const colName = getCol(['namaproyek', 'nama', 'proyek'])
  const colCustomerName = getCol(['namapelanggan', 'pelanggan', 'namaperusahaan', 'customer'])
  const colContactName = getCol(['namakeyperson', 'keyperson', 'kontak', 'piccustomer'])
  const colStatus = getCol(['statusproyek', 'status'])
  const colEstimatedValue = getCol(['nilaiestimasi', 'nilaiproyek', 'estimasi', 'nilai'])
  const colLocation = getCol(['lokasiproyek', 'lokasi', 'alamat'])
  const colLatitude = getCol(['latitude', 'lat'])
  const colLongitude = getCol(['longitude', 'lng', 'long'])
  const colSourceOfFunds = getCol(['sumberdana', 'dana'])
  const colPicName = getCol(['picsales', 'picinternal', 'pic'])
  const colSpkNumber = getCol(['nomorspk', 'spk', 'no_spk'])
  const colLostReason = getCol(['alasankalah', 'alasan'])
  const colWinnerCompetitor = getCol(['kompetitorpemenang', 'kompetitor', 'pemenang'])
  const colNotes = getCol(['catatan', 'keterangan'])

  if (!colName || !colCustomerName) {
    errors.push({
      sheet: projectSheet.name,
      row: 1,
      message:
        'Kolom wajib "Nama Proyek" dan "Nama Pelanggan" harus ada di baris pertama Sheet Data Proyek.',
    })
  }

  const seenNumbers = new Set<string>()
  const seenNameCustomerPairs = new Set<string>()

  let totalProjectsCount = 0

  if (colName && colCustomerName) {
    for (let rowNumber = 2; rowNumber <= projectSheet.rowCount; rowNumber++) {
      const row = projectSheet.getRow(rowNumber)
      if (isRowCompletelyEmpty(row)) continue

      totalProjectsCount++
      let isRowValid = true

      const projectNumber = colProjectNumber ? getCellString(row.getCell(colProjectNumber)) : ''
      const name = getCellString(row.getCell(colName))
      const customerName = getCellString(row.getCell(colCustomerName))
      const contactName = colContactName ? getCellString(row.getCell(colContactName)) : ''
      const statusRaw = colStatus ? getCellString(row.getCell(colStatus)) : ''
      const estimatedValue = colEstimatedValue ? getCellNumber(row.getCell(colEstimatedValue)) : undefined
      const location = colLocation ? getCellString(row.getCell(colLocation)) : ''
      const latitude = colLatitude ? getCellNumber(row.getCell(colLatitude)) : undefined
      const longitude = colLongitude ? getCellNumber(row.getCell(colLongitude)) : undefined
      const sourceOfFunds = colSourceOfFunds ? getCellString(row.getCell(colSourceOfFunds)) : ''
      const picName = colPicName ? getCellString(row.getCell(colPicName)) : ''
      const spkNumber = colSpkNumber ? getCellString(row.getCell(colSpkNumber)) : ''
      const lostReason = colLostReason ? getCellString(row.getCell(colLostReason)) : ''
      const winnerCompetitor = colWinnerCompetitor ? getCellString(row.getCell(colWinnerCompetitor)) : ''
      const notes = colNotes ? getCellString(row.getCell(colNotes)) : ''

      // Validations
      if (!name) {
        errors.push({
          sheet: projectSheet.name,
          row: rowNumber,
          field: 'Nama Proyek',
          message: 'Nama proyek wajib diisi.',
        })
        isRowValid = false
      }

      if (!customerName) {
        errors.push({
          sheet: projectSheet.name,
          row: rowNumber,
          field: 'Nama Pelanggan',
          message: 'Nama pelanggan wajib diisi.',
        })
        isRowValid = false
      }

      // Customer Lookup
      const matchedCustomer = customerName ? customerMap.get(customerName.toLowerCase().trim()) : undefined
      if (customerName && !matchedCustomer) {
        errors.push({
          sheet: projectSheet.name,
          row: rowNumber,
          field: 'Nama Pelanggan',
          value: customerName,
          message: `Pelanggan "${customerName}" tidak ditemukan di database. Pastikan nama sesuai dengan yang terdaftar.`,
        })
        isRowValid = false
      }

      // Status Validation
      let status: ProjectStatus = 'prospect'
      if (statusRaw) {
        const parsed = parseProjectStatus(statusRaw)
        if (!parsed) {
          errors.push({
            sheet: projectSheet.name,
            row: rowNumber,
            field: 'Status Proyek',
            value: statusRaw,
            message: `Status proyek "${statusRaw}" tidak valid. Pilihan: Prospek, Sedang Proses, Berhasil, Gagal.`,
          })
          isRowValid = false
        } else {
          status = parsed
        }
      }

      // Coordinates validation
      if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
        errors.push({
          sheet: projectSheet.name,
          row: rowNumber,
          field: 'Latitude',
          value: String(latitude),
          message: 'Latitude harus bernilai antara -90 dan 90.',
        })
        isRowValid = false
      }
      if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
        errors.push({
          sheet: projectSheet.name,
          row: rowNumber,
          field: 'Longitude',
          value: String(longitude),
          message: 'Longitude harus bernilai antara -180 dan 180.',
        })
        isRowValid = false
      }

      // Duplicate in sheet check
      if (projectNumber) {
        const pKey = projectNumber.toLowerCase().trim()
        if (seenNumbers.has(pKey)) {
          errors.push({
            sheet: projectSheet.name,
            row: rowNumber,
            field: 'Nomor Proyek',
            value: projectNumber,
            message: `Nomor proyek "${projectNumber}" duplikat dalam file Excel.`,
          })
          isRowValid = false
        } else {
          seenNumbers.add(pKey)
        }
      }

      if (name && customerName) {
        const pairKey = `${name.toLowerCase().trim()}|${customerName.toLowerCase().trim()}`
        if (seenNameCustomerPairs.has(pairKey)) {
          errors.push({
            sheet: projectSheet.name,
            row: rowNumber,
            field: 'Nama Proyek & Pelanggan',
            value: `${name} (${customerName})`,
            message: `Proyek "${name}" untuk pelanggan "${customerName}" muncul lebih dari 1 kali dalam file.`,
          })
          isRowValid = false
        } else {
          seenNameCustomerPairs.add(pairKey)
        }
      }

      if (isRowValid) {
        previewProjects.push({
          rowNumber,
          projectNumber: projectNumber || undefined,
          name,
          customerName,
          customerId: matchedCustomer?.id,
          contactName: contactName || undefined,
          status,
          estimatedValue,
          location: location || undefined,
          latitude,
          longitude,
          sourceOfFunds: sourceOfFunds || undefined,
          picName: picName || undefined,
          spkNumber: spkNumber || undefined,
          lostReason: lostReason || undefined,
          winnerCompetitor: winnerCompetitor || undefined,
          notes: notes || undefined,
        })
      }
    }
  }

  // 4. Parse Sheet 2: Kebutuhan Produk Proyek (if exists)
  let totalProductsCount = 0

  if (productSheet) {
    const prodHeaderMap = new Map<string, number>()
    const pFirstRow = productSheet.getRow(1)
    pFirstRow.eachCell((cell, colNumber) => {
      const norm = normalizeHeader(getCellString(cell))
      if (norm) prodHeaderMap.set(norm, colNumber)
    })

    const getPCol = (aliases: string[]): number | undefined => {
      for (const a of aliases) {
        const idx = prodHeaderMap.get(normalizeHeader(a))
        if (idx !== undefined) return idx
      }
      return undefined
    }

    const colProjRef = getPCol(['namanomorproyek', 'nomornamaproyek', 'namaproyek', 'nomorproyek', 'proyek', 'ref'])
    const colProdName = getPCol(['namaproduk', 'produk'])
    const colQuantity = getPCol(['volumejumlah', 'jumlah', 'volume', 'qty', 'kuantitas'])
    const colUnit = getPCol(['satuan', 'unit'])

    if (colProjRef && colProdName && colQuantity) {
      for (let rowNumber = 2; rowNumber <= productSheet.rowCount; rowNumber++) {
        const row = productSheet.getRow(rowNumber)
        if (isRowCompletelyEmpty(row)) continue

        totalProductsCount++
        let isProdValid = true

        const projectRef = getCellString(row.getCell(colProjRef))
        const productName = getCellString(row.getCell(colProdName))
        const quantity = getCellNumber(row.getCell(colQuantity))
        const unit = colUnit ? getCellString(row.getCell(colUnit)) : ''

        if (!projectRef) {
          errors.push({
            sheet: productSheet.name,
            row: rowNumber,
            field: 'Nama/Nomor Proyek',
            message: 'Nama atau nomor proyek wajib diisi.',
          })
          isProdValid = false
        }

        if (!productName) {
          errors.push({
            sheet: productSheet.name,
            row: rowNumber,
            field: 'Nama Produk',
            message: 'Nama produk wajib diisi.',
          })
          isProdValid = false
        }

        const matchedProduct = productName ? productMap.get(productName.toLowerCase().trim()) : undefined
        if (productName && !matchedProduct) {
          errors.push({
            sheet: productSheet.name,
            row: rowNumber,
            field: 'Nama Produk',
            value: productName,
            message: `Produk "${productName}" tidak ditemukan di master katalog produk.`,
          })
          isProdValid = false
        }

        if (quantity === undefined || quantity <= 0) {
          errors.push({
            sheet: productSheet.name,
            row: rowNumber,
            field: 'Volume/Jumlah',
            value: String(quantity ?? ''),
            message: 'Volume / jumlah produk harus berupa angka positif lebih dari 0.',
          })
          isProdValid = false
        }

        if (isProdValid && matchedProduct && quantity) {
          previewProducts.push({
            rowNumber,
            projectRef,
            productName,
            productId: matchedProduct.id,
            quantity,
            unit: unit || matchedProduct.unit || undefined,
          })
        }
      }
    }
  }

  return {
    totalProjects: totalProjectsCount,
    validProjects: previewProjects.length,
    totalProducts: totalProductsCount,
    validProducts: previewProducts.length,
    errors,
    previewProjects,
    previewProducts,
  }
}
