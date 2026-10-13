import ExcelJS from 'exceljs'

import type { ProjectUsecaseDeps } from '../project.usecase'

export async function generateTemplate(deps: ProjectUsecaseDeps): Promise<Buffer> {
  const [customersResult, productsResult] = await Promise.all([
    deps.customerRepo.findList({ pagination: { page: 1, per_page: 500 } }),
    deps.productUsecase.findList({ isActive: true, pagination: { page: 1, per_page: 500 } }),
  ])

  const activeCustomers = customersResult.items.filter((c) => c.status !== 'inactive')
  const activeProducts = productsResult.items.filter((p) => p.isActive)

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'CRM Wika'
  workbook.lastModifiedBy = 'CRM Wika'
  workbook.created = new Date()

  const headerFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E3A8A' }, // Navy blue
  }

  const headerFont: Partial<ExcelJS.Font> = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' },
  }

  // -------------------------------------------------------------------------
  // Sheet 1: Data Proyek
  // -------------------------------------------------------------------------
  const projectSheet = workbook.addWorksheet('Data Proyek')

  projectSheet.columns = [
    { header: 'Nomor Proyek', key: 'projectNumber', width: 20 },
    { header: 'Nama Proyek *', key: 'name', width: 34 },
    { header: 'Nama Pelanggan *', key: 'customerName', width: 34 },
    { header: 'Nama Key Person', key: 'contactName', width: 24 },
    { header: 'Status Proyek', key: 'status', width: 18 },
    { header: 'Nilai Estimasi (Rp)', key: 'estimatedValue', width: 24 },
    { header: 'Lokasi Proyek', key: 'location', width: 32 },
    { header: 'Latitude', key: 'latitude', width: 16 },
    { header: 'Longitude', key: 'longitude', width: 16 },
    { header: 'Sumber Dana', key: 'sourceOfFunds', width: 20 },
    { header: 'PIC Sales / Internal', key: 'picName', width: 24 },
    { header: 'Nomor SPK', key: 'spkNumber', width: 20 },
    { header: 'Alasan Kalah', key: 'lostReason', width: 24 },
    { header: 'Kompetitor Pemenang', key: 'winnerCompetitor', width: 24 },
    { header: 'Catatan', key: 'notes', width: 32 },
  ]

  const projHeaderRow = projectSheet.getRow(1)
  projHeaderRow.height = 24
  projHeaderRow.eachCell((cell) => {
    cell.fill = headerFill
    cell.font = headerFont
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })

  // Sample row 1
  projectSheet.addRow({
    projectNumber: 'PRJ-2026-001',
    name: 'Pembangunan Jembatan Cisadane II',
    customerName: activeCustomers[0]?.name || 'PT Wijaya Konstruksi Sejahtera',
    contactName: 'Ir. Budi Santoso',
    status: 'Sedang Proses',
    estimatedValue: 2500000000,
    location: 'Bogor, Jawa Barat',
    latitude: -6.5971,
    longitude: 106.806,
    sourceOfFunds: 'APBN',
    picName: 'Ahmad Fauzi',
    spkNumber: 'SPK-WIKA-2026/04',
    lostReason: '',
    winnerCompetitor: '',
    notes: 'Kebutuhan girder precast dan tiang pancang untuk Q3',
  })

  // Sample row 2
  projectSheet.addRow({
    projectNumber: '',
    name: 'Gedung Kantor Pusat Tower B',
    customerName: activeCustomers[1]?.name || 'PT Pembangunan Perumahan',
    contactName: '',
    status: 'Prospek',
    estimatedValue: 1200000000,
    location: 'Jakarta Timur',
    latitude: -6.225,
    longitude: 106.865,
    sourceOfFunds: 'BUMN',
    picName: 'Siti Rahma',
    spkNumber: '',
    lostReason: '',
    winnerCompetitor: '',
    notes: 'Nomor proyek kosong akan otomatis dibuatkan oleh sistem',
  })

  // -------------------------------------------------------------------------
  // Sheet 2: Kebutuhan Produk Proyek
  // -------------------------------------------------------------------------
  const productSheet = workbook.addWorksheet('Kebutuhan Produk Proyek')

  productSheet.columns = [
    { header: 'Nama / Nomor Proyek *', key: 'projectRef', width: 34 },
    { header: 'Nama Produk *', key: 'productName', width: 30 },
    { header: 'Volume / Jumlah *', key: 'quantity', width: 20 },
    { header: 'Satuan', key: 'unit', width: 16 },
  ]

  const prodHeaderRow = productSheet.getRow(1)
  prodHeaderRow.height = 24
  prodHeaderRow.eachCell((cell) => {
    cell.fill = headerFill
    cell.font = headerFont
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })

  // Sample product rows
  productSheet.addRow({
    projectRef: 'Pembangunan Jembatan Cisadane II',
    productName: activeProducts[0]?.name || 'Beton Ready Mix K-350',
    quantity: 500,
    unit: activeProducts[0]?.unit || 'm3',
  })
  productSheet.addRow({
    projectRef: 'Pembangunan Jembatan Cisadane II',
    productName: activeProducts[1]?.name || 'Tiang Pancang D-400',
    quantity: 120,
    unit: activeProducts[1]?.unit || 'batang',
  })

  // -------------------------------------------------------------------------
  // Sheet 3: Panduan & Master Data
  // -------------------------------------------------------------------------
  const guideSheet = workbook.addWorksheet('Panduan & Master Data')

  guideSheet.columns = [
    { header: 'Grup Master Data', key: 'group', width: 24 },
    { header: 'Nilai Valid (Copy & Paste ke Kolom Terkait)', key: 'value', width: 38 },
    { header: 'Keterangan', key: 'notes', width: 40 },
  ]

  const guideHeaderRow = guideSheet.getRow(1)
  guideHeaderRow.height = 24
  guideHeaderRow.eachCell((cell) => {
    cell.fill = headerFill
    cell.font = headerFont
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })

  // Standard Enums
  guideSheet.addRow({
    group: 'Status Proyek',
    value: 'Prospek',
    notes: 'Default jika dikosongkan (tahap awal negosiasi)',
  })
  guideSheet.addRow({
    group: 'Status Proyek',
    value: 'Sedang Proses',
    notes: 'Tahap penawaran / evaluasi tender',
  })
  guideSheet.addRow({
    group: 'Status Proyek',
    value: 'Berhasil',
    notes: 'Proyek dimenangkan (SPK terbit)',
  })
  guideSheet.addRow({
    group: 'Status Proyek',
    value: 'Gagal',
    notes: 'Proyek tidak berhasil / kalah tender',
  })

  guideSheet.addRow({
    group: 'Sumber Dana (Umum)',
    value: 'APBN',
    notes: 'Anggaran Pendapatan dan Belanja Negara',
  })
  guideSheet.addRow({
    group: 'Sumber Dana (Umum)',
    value: 'APBD',
    notes: 'Anggaran Pendapatan dan Belanja Daerah',
  })
  guideSheet.addRow({
    group: 'Sumber Dana (Umum)',
    value: 'BUMN',
    notes: 'Anggaran Badan Usaha Milik Negara',
  })
  guideSheet.addRow({
    group: 'Sumber Dana (Umum)',
    value: 'Swasta',
    notes: 'Investasi / anggaran pihak swasta',
  })

  // Dynamic Customers from DB
  for (const c of activeCustomers.slice(0, 100)) {
    guideSheet.addRow({
      group: 'Pelanggan Terdaftar di DB',
      value: c.name,
      notes: `ID: ${c.id.slice(0, 8)}... (Siap digunakan di kolom Nama Pelanggan)`,
    })
  }

  // Dynamic Products from DB
  for (const p of activeProducts.slice(0, 100)) {
    guideSheet.addRow({
      group: 'Produk Terdaftar di DB',
      value: p.name,
      notes: `Satuan: ${p.unit || '-'} (Siap digunakan di Sheet Kebutuhan Produk)`,
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
}
