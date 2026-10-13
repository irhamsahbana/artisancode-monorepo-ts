import { describe, expect, it, mock } from 'bun:test'
import ExcelJS from 'exceljs'

import type { IContactRepo } from '@/contracts/contact.contract'
import type { ICustomerRepo } from '@/contracts/customer.contract'
import type { IProductUsecase } from '@/contracts/product.contract'
import type { IProjectRepo } from '@/contracts/project.contract'

import { dryRunImport } from '../project.usecase/dry-run-import'
import { executeImport } from '../project.usecase/execute-import'
import { generateTemplate } from '../project.usecase/generate-template'

import type { ProjectUsecaseDeps } from '../project.usecase'

describe('Project Import Usecases', () => {
  const existingCustomer = {
    id: 'cust-1',
    name: 'PT Wijaya Konstruksi',
    status: 'active' as const,
    categoryId: null,
    segmentationId: null,
    areaId: null,
    potential: 'high' as const,
    hasContractHistory: true,
    lastRevenue: '1000000',
    lastContractYear: 2024,
    primaryContactId: null,
    companyType: 'bumn' as const,
    address: 'Jakarta',
    npwp: null,
    skt: null,
    companyEmail: null,
    website: null,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const existingProduct = {
    id: 'prod-1',
    name: 'Beton K-350',
    unit: 'm3',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockProjectRepo: IProjectRepo = {
    create: mock(async (req) => ({
      id: 'prj-created-1',
      projectNumber: req.projectNumber || 'PRJ-AUTO-01',
      customerId: req.customerId,
      contactId: req.contactId || null,
      name: req.name,
      location: req.location || null,
      latitude: req.latitude || null,
      longitude: req.longitude || null,
      sourceOfFunds: req.sourceOfFunds || null,
      picName: req.picName || null,
      status: req.status || 'prospect',
      estimatedValue: req.estimatedValue || null,
      spkNumber: req.spkNumber || null,
      lostReason: req.lostReason || null,
      winnerCompetitor: req.winnerCompetitor || null,
      products: req.products || [],
      notes: req.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    findById: mock(async () => null),
    findList: mock(async () => ({ items: [], pagination: {} as any })),
    findMapMarkers: mock(async () => []),
    update: mock(async (req) => ({
      id: req.id,
      projectNumber: req.projectNumber || 'PRJ-UPDATED',
      customerId: req.customerId || 'cust-1',
      contactId: req.contactId || null,
      name: req.name || 'Updated Project',
      location: req.location || null,
      latitude: req.latitude || null,
      longitude: req.longitude || null,
      sourceOfFunds: req.sourceOfFunds || null,
      picName: req.picName || null,
      status: req.status || 'in_progress',
      estimatedValue: req.estimatedValue || null,
      spkNumber: req.spkNumber || null,
      lostReason: req.lostReason || null,
      winnerCompetitor: req.winnerCompetitor || null,
      products: req.products || [],
      notes: req.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    delete: mock(async () => {}),
    createVisit: mock(async () => ({}) as any),
    findVisitsByProjectId: mock(async () => []),
    findAllVisits: mock(async () => []),
    findProjectsByNumbers: mock(async (numbers: string[]) => {
      if (numbers.includes('PRJ-EXISTING')) {
        return [
          {
            id: 'prj-existing-1',
            projectNumber: 'PRJ-EXISTING',
            customerId: 'cust-1',
            contactId: null,
            name: 'Proyek Lama',
            location: null,
            latitude: null,
            longitude: null,
            sourceOfFunds: null,
            picName: null,
            status: 'prospect' as const,
            estimatedValue: 1000000,
            spkNumber: null,
            lostReason: null,
            winnerCompetitor: null,
            products: [],
            notes: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]
      }
      return []
    }),
    findProjectsByNamesAndCustomers: mock(async () => []),
  }

  const mockCustomerRepo: ICustomerRepo = {
    create: mock(async () => ({}) as any),
    findById: mock(async () => null),
    findList: mock(async () => ({
      items: [existingCustomer],
      pagination: { total: 1, page: 1, per_page: 500, last_page: 1 },
    })),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
    findCustomersByNames: mock(async () => [existingCustomer]),
  }

  const mockContactRepo: IContactRepo = {
    create: mock(async () => ({}) as any),
    findById: mock(async () => null),
    findList: mock(async () => ({ items: [], pagination: {} as any })),
    search: mock(async () => []),
    searchPersons: mock(async () => ({
      items: [],
      pagination: { total: 0, page: 1, per_page: 10, last_page: 1 },
    })),
    update: mock(async () => null),
    delete: mock(async () => {}),
  }

  const mockProductUsecase: IProductUsecase = {
    create: mock(async () => ({}) as any),
    findList: mock(async () => ({
      items: [existingProduct],
      pagination: { total: 1, page: 1, per_page: 500, last_page: 1 },
    })),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
  }

  const deps: ProjectUsecaseDeps = {
    repo: mockProjectRepo,
    customerRepo: mockCustomerRepo,
    contactRepo: mockContactRepo,
    productUsecase: mockProductUsecase,
  }

  it('generateTemplate should return valid Excel workbook with 3 sheets', async () => {
    const buffer = await generateTemplate(deps)
    expect(buffer).toBeDefined()
    expect(buffer.length).toBeGreaterThan(0)

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer as any)

    expect(workbook.worksheets.length).toBe(3)
    expect(workbook.getWorksheet('Data Proyek')).toBeDefined()
    expect(workbook.getWorksheet('Kebutuhan Produk Proyek')).toBeDefined()
    expect(workbook.getWorksheet('Panduan & Master Data')).toBeDefined()
  })

  it('dryRunImport should validate valid project rows and report error on unknown customer', async () => {
    const workbook = new ExcelJS.Workbook()
    const projSheet = workbook.addWorksheet('Data Proyek')
    projSheet.addRow([
      'Nomor Proyek',
      'Nama Proyek',
      'Nama Pelanggan',
      'Status Proyek',
      'Nilai Estimasi (Rp)',
    ])
    // Valid row matching existingCustomer
    projSheet.addRow([
      'PRJ-101',
      'Tol Cisumdawu Seksi 4',
      'PT Wijaya Konstruksi',
      'Sedang Proses',
      '5000000000',
    ])
    // Invalid row with non-existent customer
    projSheet.addRow([
      'PRJ-102',
      'Gedung Kantor Baru',
      'PT Antah Berantah Non Existent',
      'Prospek',
      '100000000',
    ])

    const buffer = await workbook.xlsx.writeBuffer()
    const result = await dryRunImport(deps, Buffer.from(buffer))

    expect(result.totalProjects).toBe(2)
    expect(result.validProjects).toBe(1)
    expect(result.errors.length).toBeGreaterThanOrEqual(1)
    expect(result.errors.some((e) => e.field === 'Nama Pelanggan')).toBe(true)
    expect(result.previewProjects[0].name).toBe('Tol Cisumdawu Seksi 4')
    expect(result.previewProjects[0].status).toBe('in_progress')
  })

  it('executeImport should create valid projects and handle mode', async () => {
    const workbook = new ExcelJS.Workbook()
    const projSheet = workbook.addWorksheet('Data Proyek')
    projSheet.addRow([
      'Nomor Proyek',
      'Nama Proyek',
      'Nama Pelanggan',
      'Status Proyek',
      'Nilai Estimasi',
    ])
    projSheet.addRow([
      'PRJ-999',
      'Flyover Cengkareng',
      'PT Wijaya Konstruksi',
      'Berhasil',
      '7500000000',
    ])

    const buffer = await workbook.xlsx.writeBuffer()
    const result = await executeImport(deps, { file: Buffer.from(buffer), mode: 'skip' })

    expect(result.createdProjects).toBe(1)
    expect(result.updatedProjects).toBe(0)
    expect(mockProjectRepo.create).toHaveBeenCalled()
  })
})
