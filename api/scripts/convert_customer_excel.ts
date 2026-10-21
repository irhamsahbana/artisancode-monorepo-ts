/**
 * Convert the legacy customer list (columns: PELANGGAN_ID, UNIT, NAMA, TELP, FAX,
 * ALAMAT, NPWP, KOTA, CONTACT_PERSON — any number of sheets) into the CRM customer
 * import template (sheets "Data Customer" + "Data Key Person").
 *
 * Usage (from api/):
 *   bun scripts/convert_customer_excel.ts <input.xlsx> [output.xlsx]
 *
 * Also writes <output>.areas.json (normalized area names, for src/db/seed/areas.ts)
 * and validates the output with the real dryRunImport, treating those areas as master data.
 */
import ExcelJS from 'exceljs'

import { dryRunImport } from '../src/modules/customer/customer.usecase/dry-run-import'

import type { CustomerUsecaseDeps } from '../src/modules/customer/customer.usecase'

const [input, output = input?.replace(/\.xlsx$/i, ' - import.xlsx')] = process.argv.slice(2)
if (!input) {
  console.error('Usage: bun scripts/convert_customer_excel.ts <input.xlsx> [output.xlsx]')
  process.exit(1)
}

const cellText = (v: ExcelJS.CellValue): string => {
  if (v == null) return ''
  if (typeof v === 'object' && !(v instanceof Date)) {
    if ('result' in v) return String(v.result ?? '').trim()
    if ('text' in v) return String(v.text ?? '').trim()
    if ('richText' in v)
      return v.richText
        .map((t) => t.text)
        .join('')
        .trim()
  }
  return String(v).trim()
}
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// Keeps the original "<name>, <type>" order; only fixes spacing, "Kanza. PT" -> "Kanza, PT"
// and strips a dangling trailing comma ("Dinas PU, " -> "Dinas PU").
export function companyName(raw: string): string {
  return raw
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*[,.]\s*(PT|CV)\.?$/i, (_, type: string) => `, ${type.toUpperCase()}`)
    .replace(/[,\s]+$/, '')
}

// KOTA is free text: fix case, typos, truncations, postal codes
const AREA_ALIAS: Record<string, string> = {
  bnadung: 'Bandung',
  makasar: 'Makassar',
  tanggerang: 'Tangerang',
  lampu: 'Lampung',
  'dki jakarta': 'Jakarta',
  'di yogyakarta': 'Yogyakarta',
  jatinegara: 'Jakarta Timur',
  'kotawaringin br': 'Kotawaringin Barat',
  'hulu sungai ten': 'Hulu Sungai Tengah',
  'sumatera selata': 'Sumatera Selatan',
  'kepulauan selay': 'Kepulauan Selayar',
  selayar: 'Kepulauan Selayar',
  'tangerang sel': 'Tangerang Selatan',
  'tang-sel': 'Tangerang Selatan',
  'kab. gowa': 'Gowa',
  'kab. banyuasin': 'Banyuasin',
  'kota bekasi': 'Bekasi',
  'kota palembang': 'Palembang',
  'kota baru': 'Kotabaru',
  'oki - sumsel': 'OKI',
  minahasaselatan: 'Minahasa Selatan',
  'pkl.pinang': 'Pangkal Pinang',
  'kep. meranti': 'Kepulauan Meranti',
  'kep. sangihe': 'Kepulauan Sangihe',
  'tanjab barat': 'Tanjung Jabung Barat',
  'metro lampung': 'Metro',
  'lewet - amurang': 'Amurang',
}
const UPPER_WORDS = new Set(['DKI', 'OKI', 'DI'])

export function normalizeArea(raw: string): string {
  const v = raw
    .replace(/\s+/g, ' ')
    .replace(/\s*\d{5}$/, '')
    .trim()
  if (!/[a-z]/i.test(v)) return ''
  const alias = AREA_ALIAS[v.toLowerCase()]
  if (alias) return alias
  return v
    .toLowerCase()
    .split(' ')
    .map((w) =>
      UPPER_WORDS.has(w.toUpperCase()) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1),
    )
    .join(' ')
}

// 15-digit NPWP -> "XX.XXX.XXX.X-YYY.ZZZ"; 16-digit badan NPWP is the 15-digit one with a
// leading 0 (since 2022), so it is stripped to match. Placeholders (all zeros) -> empty.
// Anything else (NIK, truncated numbers) is kept as typed, and not used for matching.
export function normalizeNpwp(raw: string): { digits: string; display: string } {
  let digits = raw.replace(/\D/g, '')
  if (!/[1-9]/.test(digits)) return { digits: '', display: '' }
  if (digits.length === 16 && digits.startsWith('0')) digits = digits.slice(1)
  if (digits.length !== 15) return { digits: '', display: raw.trim() }
  const d = digits
  return {
    digits,
    display: `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}.${d[8]}-${d.slice(9, 12)}.${d.slice(12)}`,
  }
}

// Same NPWP alone is not enough (e.g. every PLN area shares the parent NPWP), so two
// spellings are one customer only if one name's words are all contained in the other's.
const STOP_WORDS = new Set(['pt', 'cv', 'tbk', 'persero'])
const words = (name: string) =>
  new Set(
    name
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w && !STOP_WORDS.has(w)),
  )
const isSubset = (a: Set<string>, b: Set<string>) => a.size > 0 && [...a].every((w) => b.has(w))
const sameCompany = (a: Set<string>, b: Set<string>) => isSubset(a, b) || isSubset(b, a)

// First number only, digits only. Old area codes are often written with an extra 0
// ("0021-..." = 021 Jakarta, "0061-..." = 061 Medan), so "00" + area code -> "0" + area code.
export function cleanPhone(raw: string): string {
  const digits = raw.split(/[/,;&]|\bdan\b/i)[0].replace(/\D/g, '')
  return /^00[1-7]\d{7,}$/.test(digits) ? digits.slice(1) : digits
}
// Indonesian mobile = 08xx / 628xx, 10-13 digits; everything else is a landline (or junk)
export const isMobile = (digits: string) => /^(0|62)8\d{8,11}$/.test(digits)
const guessGender = (n: string) =>
  /^(bp|bpk|bapak|pak)\b/i.test(n) || /,\s*(bp|bpk|bapak)\.?$/i.test(n)
    ? 'Laki-laki'
    : /^(ibu|bu)\b/i.test(n) || /,\s*ibu\.?$/i.test(n)
      ? 'Perempuan'
      : ''

interface Customer {
  name: string
  type: string
  area: string
  address: string
  npwp: string
  ids: Set<string>
  units: Set<string>
  kota: Set<string>
  telp: Set<string>
  fax: Set<string>
  contactsWithoutPhone: Set<string>
}
interface KeyPerson {
  customerName: string
  name: string
  whatsapp: string
  landline: string
  gender: string
}

const customers = new Map<string, Customer>()
const keyPersons = new Map<string, KeyPerson>()
const customersByNpwp = new Map<string, { key: string; words: Set<string> }[]>()

const source = new ExcelJS.Workbook()
await source.xlsx.readFile(input)

for (const ws of source.worksheets) {
  const headers: string[] = []
  ws.getRow(1).eachCell((c, n) => (headers[n] = cellText(c.value).toUpperCase()))
  if (!headers.includes('NAMA')) {
    console.warn(`skip sheet "${ws.name}": no NAMA column`)
    continue
  }

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r)
    const get = (col: string) => {
      const i = headers.indexOf(col)
      return i < 0 ? '' : cellText(row.getCell(i).value)
    }
    const raw = get('NAMA')
    if (!raw) continue

    // same company spelled differently (case/punctuation, or same NPWP + contained name) -> one customer; first value wins
    const name = companyName(raw)
    const npwp = normalizeNpwp(get('NPWP'))
    const npwpDigits = npwp.digits
    const hasNpwp = npwpDigits !== ''
    const nameWords = words(name)
    let k = key(name)
    if (!customers.has(k) && hasNpwp) {
      const match = (customersByNpwp.get(npwpDigits) ?? []).find((e) =>
        sameCompany(e.words, nameWords),
      )
      if (match) k = match.key
    }
    let c = customers.get(k)
    if (!c) {
      c = {
        name,
        // only "Perorangan" is derivable from the name; BUMN/swasta can't be told apart
        type: /\bperorangan\.?$/i.test(name) ? 'Perorangan' : '',
        area: '',
        address: '',
        npwp: '',
        ids: new Set(),
        units: new Set(),
        kota: new Set(),
        telp: new Set(),
        fax: new Set(),
        contactsWithoutPhone: new Set(),
      }
      customers.set(k, c)
      if (hasNpwp) {
        const list = customersByNpwp.get(npwpDigits) ?? []
        list.push({ key: k, words: nameWords })
        customersByNpwp.set(npwpDigits, list)
      }
    }
    c.area ||= normalizeArea(get('KOTA'))
    c.address ||= get('ALAMAT').replace(/\s*\n\s*/g, ', ')
    c.npwp ||= npwp.display
    const sets: [string, Set<string>][] = [
      ['PELANGGAN_ID', c.ids],
      ['UNIT', c.units],
      ['KOTA', c.kota],
      ['TELP', c.telp],
      ['FAX', c.fax],
    ]
    for (const [col, set] of sets) if (get(col)) set.add(get(col))

    const cp = get('CONTACT_PERSON').replace(/\s+/g, ' ')
    const telp = get('TELP')
    // some rows put a phone number in CONTACT_PERSON; that's not a person (the number is already TELP)
    if (!/\p{L}/u.test(cp)) continue
    const phone = cleanPhone(telp)
    // dryRunImport needs WhatsApp or Telepon Tetap (6..15 digits); otherwise keep contact in notes
    if (phone.length >= 6 && phone.length <= 15) {
      const kk = `${k}|${key(cp)}`
      if (!keyPersons.has(kk)) {
        const mobile = isMobile(phone)
        keyPersons.set(kk, {
          customerName: c.name,
          name: cp,
          whatsapp: mobile ? phone : '',
          landline: mobile ? '' : phone,
          gender: guessGender(cp),
        })
      }
    } else {
      c.contactsWithoutPhone.add(telp ? `${cp} (${telp})` : cp)
    }
  }
}

// ---------------------------------------------------------------------------
// Write import template
// ---------------------------------------------------------------------------
const out = new ExcelJS.Workbook()
const styleHeader = (ws: ExcelJS.Worksheet) =>
  ws.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } }
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  })

const customerSheet = out.addWorksheet('Data Customer')
customerSheet.columns = [
  ['Nama Perusahaan *', 40],
  ['Kategori / Sektor', 18],
  ['Segmentasi', 14],
  ['Area', 18],
  ['Tipe Perusahaan', 16],
  ['Status', 10],
  ['Potensial', 10],
  ['Pernah Kontrak?', 14],
  ['Tahun Kontrak Terakhir', 12],
  ['Nilai Pendapatan Terakhir (Rp)', 14],
  ['Alamat', 50],
  ['Email Perusahaan', 20],
  ['Telepon Kantor', 18],
  ['Kode Negara Telepon', 14],
  ['Fax', 18],
  ['Kode Negara Fax', 14],
  ['Website', 20],
  ['NPWP', 24],
  ['SKT', 10],
  ['Catatan', 60],
].map(([header, width]) => ({ header: String(header), width: Number(width) }))
styleHeader(customerSheet)
for (const col of [13, 14, 15, 16, 18]) customerSheet.getColumn(col).numFmt = '@' // phones, codes, NPWP as text

const joined = (s: Set<string>) => [...s].join(', ')
const validPhone = (d: string) => d.length >= 6 && d.length <= 15
for (const c of customers.values()) {
  const phone = cleanPhone([...c.telp][0] ?? '')
  const fax = cleanPhone([...c.fax][0] ?? '')
  // numbers that can't be a valid phone stay in notes instead of being lost
  const notes = [
    phone && !validPhone(phone) && `Telp (tidak valid): ${joined(c.telp)}`,
    fax && !validPhone(fax) && `Fax (tidak valid): ${joined(c.fax)}`,
    c.ids.size && `ID Pelanggan: ${joined(c.ids)}`,
    c.units.size && `Unit: ${joined(c.units)}`,
    c.kota.size && `Kota: ${joined(c.kota)}`,
    c.contactsWithoutPhone.size &&
      `Contact person (tanpa no. telp valid): ${joined(c.contactsWithoutPhone)}`,
  ]
    .filter(Boolean)
    .join(' | ')
  // ponytail: legacy list = past customers, so Aktif / Pernah Kontrak Ya / Sedang
  customerSheet.addRow([
    c.name,
    '',
    '',
    c.area,
    c.type,
    'Aktif',
    'Sedang',
    'Ya',
    '',
    '',
    c.address,
    '',
    validPhone(phone) ? phone : '',
    validPhone(phone) ? '62' : '',
    validPhone(fax) ? fax : '',
    validPhone(fax) ? '62' : '',
    '',
    c.npwp,
    '',
    notes,
  ])
}

const kpSheet = out.addWorksheet('Data Key Person')
kpSheet.columns = [
  'Nama Perusahaan *',
  'Nama Lengkap PIC *',
  'Jabatan',
  'Nomor WhatsApp *',
  'Kode Negara WhatsApp',
  'Telepon Tetap *',
  'Kode Negara Telepon Tetap',
  'Email',
  'Kontak Penting?',
  'Jenis Kelamin',
  'Tempat Lahir',
  'Tanggal Lahir (YYYY-MM-DD)',
  'Agama',
  'Pendidikan Terakhir',
  'Alamat Tinggal',
  'Nama Pasangan',
  'Pekerjaan Pasangan',
  'Nama Anak',
  'Pekerjaan Anak',
  'Catatan / Profiling',
].map((header, i) => ({ header, width: i < 2 ? 36 : 18 }))
styleHeader(kpSheet)
for (const col of [4, 5, 6, 7]) kpSheet.getColumn(col).numFmt = '@' // keep leading 0

const hasPrimary = new Set<string>()
for (const kp of keyPersons.values()) {
  const isPrimary = !hasPrimary.has(kp.customerName)
  hasPrimary.add(kp.customerName)
  kpSheet.addRow([
    kp.customerName,
    kp.name,
    '',
    kp.whatsapp,
    kp.whatsapp ? '62' : '',
    kp.landline,
    kp.landline ? '62' : '',
    '',
    isPrimary ? 'Ya' : 'Tidak',
    kp.gender,
    ...Array<string>(9).fill(''),
    'Nomor diambil dari kolom TELP perusahaan',
  ])
}

await out.xlsx.writeFile(output)
const areas = [...new Set([...customers.values()].map((c) => c.area).filter(Boolean))].sort()
const areasFile = output.replace(/\.xlsx$/i, '.areas.json')
await Bun.write(areasFile, JSON.stringify(areas, null, 2))

// ---------------------------------------------------------------------------
// Validate with the real import parser (areas above as master data, empty DB)
// ---------------------------------------------------------------------------
const deps = {
  categoryUsecase: {
    findList: async ({ group }: { group: string }) => ({
      items:
        group === 'area' ? areas.map((name, i) => ({ id: `a${i}`, name, status: 'active' })) : [],
    }),
  },
  repo: { findCustomersByNames: async () => [] },
} as unknown as CustomerUsecaseDeps
const result = await dryRunImport(deps, Buffer.from(await Bun.file(output).arrayBuffer()))

console.log({
  output,
  areasFile,
  customers: `${result.validCustomers}/${result.totalCustomers} valid`,
  withArea: [...customers.values()].filter((c) => c.area).length,
  keyPersons: `${result.validKeyPersons}/${result.totalKeyPersons} valid`,
  areas: areas.length,
  errors: result.errors.length,
})
for (const e of result.errors.slice(0, 20))
  console.log(`  [${e.sheet} #${e.row}] ${e.field}: ${e.message}`)
