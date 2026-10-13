import ExcelJS from 'exceljs'

import type { CustomerUsecaseDeps } from '../customer.usecase'

export async function generateTemplate(deps: CustomerUsecaseDeps): Promise<Buffer> {
  const [categories, segmentations, areas] = await Promise.all([
    deps.categoryUsecase.findList({ group: 'category', pagination: { page: 1, per_page: 500 } }),
    deps.categoryUsecase.findList({
      group: 'segmentation',
      pagination: { page: 1, per_page: 500 },
    }),
    deps.categoryUsecase.findList({ group: 'area', pagination: { page: 1, per_page: 500 } }),
  ])

  const activeCategories = categories.items.filter((c) => c.status === 'active')
  const activeSegmentations = segmentations.items.filter((s) => s.status === 'active')
  const activeAreas = areas.items.filter((a) => a.status === 'active')

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
  // Sheet 1: Data Customer
  // -------------------------------------------------------------------------
  const customerSheet = workbook.addWorksheet('Data Customer')

  customerSheet.columns = [
    { header: 'Nama Perusahaan *', key: 'name', width: 32 },
    { header: 'Kategori / Sektor', key: 'categoryName', width: 22 },
    { header: 'Segmentasi', key: 'segmentationName', width: 20 },
    { header: 'Area', key: 'areaName', width: 20 },
    { header: 'Tipe Perusahaan', key: 'companyType', width: 20 },
    { header: 'Status', key: 'status', width: 16 },
    { header: 'Potensial', key: 'potential', width: 16 },
    { header: 'Pernah Kontrak?', key: 'hasContractHistory', width: 18 },
    { header: 'Tahun Kontrak Terakhir', key: 'lastContractYear', width: 22 },
    { header: 'Nilai Pendapatan Terakhir (Rp)', key: 'lastRevenue', width: 26 },
    { header: 'Alamat', key: 'address', width: 36 },
    { header: 'Email Perusahaan', key: 'companyEmail', width: 26 },
    { header: 'Website', key: 'website', width: 26 },
    { header: 'NPWP', key: 'npwp', width: 24 },
    { header: 'SKT', key: 'skt', width: 20 },
    { header: 'Catatan', key: 'notes', width: 30 },
  ]

  const custHeaderRow = customerSheet.getRow(1)
  custHeaderRow.height = 24
  custHeaderRow.eachCell((cell) => {
    cell.fill = headerFill
    cell.font = headerFont
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })

  // Sample row 1
  customerSheet.addRow({
    name: 'PT Wijaya Konstruksi Sejahtera',
    categoryName: activeCategories[0]?.name || '',
    segmentationName: activeSegmentations[0]?.name || 'Korporat',
    areaName: activeAreas[0]?.name || 'Jakarta Selatan',
    companyType: 'BUMN',
    status: 'Aktif',
    potential: 'Tinggi',
    hasContractHistory: 'Ya',
    lastContractYear: 2024,
    lastRevenue: 2500000000,
    address: 'Jl. D.I. Panjaitan Kav. 9, Cawang, Jakarta Timur',
    companyEmail: 'kontak@wika-sejahtera.com',
    website: 'https://www.wika.co.id',
    npwp: '01.234.567.8-901.000',
    skt: 'SKT-99881',
    notes: 'Klien prioritas proyek infrastruktur tol dan gedung',
  })

  // -------------------------------------------------------------------------
  // Sheet 2: Data Key Person
  // -------------------------------------------------------------------------
  const contactSheet = workbook.addWorksheet('Data Key Person')

  contactSheet.columns = [
    { header: 'Nama Perusahaan *', key: 'customerName', width: 32 },
    { header: 'Nama Lengkap PIC *', key: 'name', width: 26 },
    { header: 'Jabatan', key: 'position', width: 24 },
    { header: 'Nomor WhatsApp *', key: 'whatsapp', width: 20 },
    { header: 'Email', key: 'email', width: 26 },
    { header: 'Kontak Utama?', key: 'isPrimary', width: 16 },
    { header: 'Jenis Kelamin', key: 'gender', width: 16 },
    { header: 'Tempat Lahir', key: 'birthPlace', width: 18 },
    { header: 'Tanggal Lahir (YYYY-MM-DD)', key: 'dateOfBirth', width: 24 },
    { header: 'Agama', key: 'religion', width: 16 },
    { header: 'Pendidikan Terakhir', key: 'education', width: 20 },
    { header: 'Alamat Tinggal', key: 'address', width: 32 },
    { header: 'Nama Pasangan', key: 'spouseName', width: 22 },
    { header: 'Pekerjaan Pasangan', key: 'spouseOccupation', width: 22 },
    { header: 'Nama Anak', key: 'childrenNames', width: 24 },
    { header: 'Pekerjaan Anak', key: 'childrenOccupation', width: 24 },
    { header: 'Catatan / Profiling', key: 'profiling', width: 36 },
  ]

  const contactHeaderRow = contactSheet.getRow(1)
  contactHeaderRow.height = 24
  contactHeaderRow.eachCell((cell) => {
    cell.fill = headerFill
    cell.font = headerFont
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })

  // Sample row 1
  contactSheet.addRow({
    customerName: 'PT Wijaya Konstruksi Sejahtera',
    name: 'Ir. Budi Santoso, MT',
    position: 'General Manager Procurement',
    whatsapp: '081288992211',
    email: 'budi.santoso@wika-sejahtera.com',
    isPrimary: 'Ya',
    gender: 'Laki-laki',
    birthPlace: 'Semarang',
    dateOfBirth: '1980-08-17',
    religion: 'Islam',
    education: 'S2 Teknik Sipil',
    address: 'Jl. Puri Indah No. 12, Jakarta Barat',
    spouseName: 'Dewi Anggraini',
    spouseOccupation: 'Dosen',
    childrenNames: 'Dimas & Anisa',
    childrenOccupation: 'Mahasiswa ITB & Pelajar SMA',
    profiling: 'Pengambil keputusan tender precast, hobi olahraga bulutangkis',
  })

  // -------------------------------------------------------------------------
  // Sheet 3: Panduan & Master Data
  // -------------------------------------------------------------------------
  const guideSheet = workbook.addWorksheet('Panduan & Master Data')

  guideSheet.columns = [
    { header: 'Grup Master Data', key: 'group', width: 22 },
    { header: 'Nilai Valid (Copy & Paste ke Kolom Terkait)', key: 'value', width: 38 },
    { header: 'Keterangan', key: 'notes', width: 36 },
  ]

  const guideHeaderRow = guideSheet.getRow(1)
  guideHeaderRow.height = 24
  guideHeaderRow.eachCell((cell) => {
    cell.fill = headerFill
    cell.font = headerFont
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })

  // Standard Enums
  guideSheet.addRow({ group: 'Tipe Perusahaan', value: 'BUMN', notes: 'Pilihan tipe perusahaan' })
  guideSheet.addRow({
    group: 'Tipe Perusahaan',
    value: 'Swasta Nasional',
    notes: 'Pilihan tipe perusahaan',
  })
  guideSheet.addRow({
    group: 'Tipe Perusahaan',
    value: 'Swasta Asing',
    notes: 'Pilihan tipe perusahaan',
  })

  guideSheet.addRow({ group: 'Status Customer', value: 'Prospek', notes: 'Default: Prospek' })
  guideSheet.addRow({ group: 'Status Customer', value: 'Aktif', notes: 'Klien berjalan' })
  guideSheet.addRow({ group: 'Status Customer', value: 'Tidak Aktif', notes: 'Klien tidak aktif' })

  guideSheet.addRow({
    group: 'Potensial Customer',
    value: 'Tinggi',
    notes: 'Peluang transaksi tinggi',
  })
  guideSheet.addRow({ group: 'Potensial Customer', value: 'Sedang', notes: 'Default: Sedang' })
  guideSheet.addRow({
    group: 'Potensial Customer',
    value: 'Rendah',
    notes: 'Peluang transaksi rendah',
  })

  guideSheet.addRow({ group: 'Jenis Kelamin', value: 'Laki-laki', notes: 'Key person gender' })
  guideSheet.addRow({ group: 'Jenis Kelamin', value: 'Perempuan', notes: 'Key person gender' })

  guideSheet.addRow({
    group: 'Pilihan Boolean',
    value: 'Ya',
    notes: 'Untuk Pernah Kontrak / Kontak Utama',
  })
  guideSheet.addRow({
    group: 'Pilihan Boolean',
    value: 'Tidak',
    notes: 'Untuk Pernah Kontrak / Kontak Utama',
  })

  // Database Categories
  for (const cat of categories.items) {
    if (cat.status === 'active') {
      guideSheet.addRow({
        group: 'Kategori / Sektor',
        value: cat.name,
        notes: 'Master Kategori / Sektor terdaftar di CRM',
      })
    }
  }
  for (const seg of segmentations.items) {
    if (seg.status === 'active') {
      guideSheet.addRow({
        group: 'Segmentasi',
        value: seg.name,
        notes: 'Master Segmentasi terdaftar di CRM',
      })
    }
  }
  for (const area of areas.items) {
    if (area.status === 'active') {
      guideSheet.addRow({
        group: 'Area',
        value: area.name,
        notes: 'Master Area terdaftar di CRM',
      })
    }
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
