import { describe, expect, it, mock } from 'bun:test'
import ExcelJS from 'exceljs'

import type { ICategoryUsecase } from '@/contracts/category.contract'
import type { IContactUsecase } from '@/contracts/contact.contract'
import type { ICustomerRepo } from '@/contracts/customer.contract'

import { dryRunImport } from '../customer.usecase/dry-run-import'
import { executeImport } from '../customer.usecase/execute-import'
import { generateTemplate } from '../customer.usecase/generate-template'

import type { CustomerUsecaseDeps } from '../customer.usecase'

describe('Customer Import Usecases', () => {
  const mockRepo: ICustomerRepo = {
    create: mock(async (req) => ({
      id: 'cust-new-1',
      name: req.name,
      categoryId: req.categoryId ?? null,
      segmentationId: req.segmentationId ?? null,
      areaId: req.areaId ?? null,
      status: req.status ?? 'prospect',
      potential: req.potential ?? 'medium',
      hasContractHistory: req.hasContractHistory ?? false,
      lastRevenue: req.lastRevenue != null ? String(req.lastRevenue) : null,
      lastContractYear: req.lastContractYear ?? null,
      primaryContactId: null,
      companyType: req.companyType ?? null,
      address: req.address ?? null,
      npwp: req.npwp ?? null,
      skt: req.skt ?? null,
      companyEmail: req.companyEmail ?? null,
      website: req.website ?? null,
      notes: req.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })),
    findById: mock(async () => null),
    findList: mock(async () => ({ items: [], pagination: {} as any })),
    update: mock(async (req) => ({
      id: req.id,
      name: req.name ?? 'updated',
      categoryId: req.categoryId ?? null,
      segmentationId: req.segmentationId ?? null,
      areaId: req.areaId ?? null,
      status: req.status ?? 'prospect',
      potential: req.potential ?? 'medium',
      hasContractHistory: req.hasContractHistory ?? false,
      lastRevenue: req.lastRevenue != null ? String(req.lastRevenue) : null,
      lastContractYear: req.lastContractYear ?? null,
      primaryContactId: req.primaryContactId ?? null,
      companyType: req.companyType ?? null,
      address: req.address ?? null,
      npwp: req.npwp ?? null,
      skt: req.skt ?? null,
      companyEmail: req.companyEmail ?? null,
      website: req.website ?? null,
      notes: req.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })),
    delete: mock(async () => {}),
    findCustomersByNames: mock(async () => []),
  }

  const mockCategoryUsecase: ICategoryUsecase = {
    create: mock(async () => ({}) as any),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
    findById: mock(async () => null),
    findList: mock(async (req) => {
      if (req.group === 'category') {
        return {
          items: [
            {
              id: 'cat-precast',
              name: 'Precast',
              group: 'category',
              status: 'active' as const,
              parent_id: null,
              created_at: new Date(),
              updated_at: new Date(),
              deleted_at: null,
            },
          ],
          pagination: { total: 1, page: 1, per_page: 500, last_page: 1 },
        }
      }
      if (req.group === 'segmentation') {
        return {
          items: [
            {
              id: 'seg-korporat',
              name: 'Korporat',
              group: 'segmentation',
              status: 'active' as const,
              parent_id: null,
              created_at: new Date(),
              updated_at: new Date(),
              deleted_at: null,
            },
          ],
          pagination: { total: 1, page: 1, per_page: 500, last_page: 1 },
        }
      }
      if (req.group === 'area') {
        return {
          items: [
            {
              id: 'area-jaksel',
              name: 'Jakarta Selatan',
              group: 'area',
              status: 'active' as const,
              parent_id: null,
              created_at: new Date(),
              updated_at: new Date(),
              deleted_at: null,
            },
          ],
          pagination: { total: 1, page: 1, per_page: 500, last_page: 1 },
        }
      }
      return { items: [], pagination: { total: 0, page: 1, per_page: 500, last_page: 1 } }
    }),
  }

  const mockContactUsecase: IContactUsecase = {
    create: mock(async (req) => ({
      id: 'contact-new-1',
      customerId: req.customer_id,
      name: req.name,
      position: req.position ?? null,
      whatsapp: req.whatsapp ?? null,
      countryCode: req.country_code ?? '62',
      email: req.email ?? null,
      gender: req.gender ?? null,
      birthPlace: req.birthPlace ?? null,
      dateOfBirth: req.dateOfBirth ?? null,
      religion: req.religion ?? null,
      education: req.education ?? null,
      address: req.address ?? null,
      spouseName: req.spouseName ?? null,
      spouseOccupation: req.spouseOccupation ?? null,
      childrenNames: req.childrenNames ?? null,
      childrenOccupation: req.childrenOccupation ?? null,
      profiling: req.profiling ?? null,
      notes: req.notes ?? null,
      isPrimary: req.isPrimary ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })),
    findById: mock(async () => null),
    findList: mock(async () => ({ items: [], pagination: {} as any })),
    search: mock(async () => []),
    searchPersons: mock(async () => ({ items: [], pagination: {} as any })),
    update: mock(async () => null),
    delete: mock(async () => {}),
  }

  const deps: CustomerUsecaseDeps = {
    repo: mockRepo,
    categoryUsecase: mockCategoryUsecase,
    contactUsecase: mockContactUsecase,
  }

  it('generateTemplate should create Excel buffer with 3 worksheets using categoryUsecase', async () => {
    const buffer = await generateTemplate(deps)
    expect(buffer).toBeDefined()
    expect(buffer.length).toBeGreaterThan(0)

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer as any)

    expect(workbook.worksheets.length).toBe(3)
    expect(workbook.getWorksheet('Data Customer')).toBeDefined()
    expect(workbook.getWorksheet('Data Key Person')).toBeDefined()
    expect(workbook.getWorksheet('Panduan & Master Data')).toBeDefined()
    expect(mockCategoryUsecase.findList).toHaveBeenCalled()
  })

  it('dryRunImport should parse generated template and extract sample preview data without errors', async () => {
    const templateBuffer = await generateTemplate(deps)
    const result = await dryRunImport(deps, templateBuffer)

    expect(result.errors.length).toBe(0)
    expect(result.totalCustomers).toBe(1)
    expect(result.validCustomers).toBe(1)
    expect(result.previewCustomers[0].name).toBe('PT Wijaya Konstruksi Sejahtera')
    expect(result.previewCustomers[0].categoryId).toBe('cat-precast')
    expect(result.previewCustomers[0].segmentationId).toBe('seg-korporat')
    expect(result.previewCustomers[0].areaId).toBe('area-jaksel')

    expect(result.totalKeyPersons).toBe(1)
    expect(result.validKeyPersons).toBe(1)
    expect(result.previewKeyPersons[0].customerName).toBe('PT Wijaya Konstruksi Sejahtera')
    expect(result.previewKeyPersons[0].name).toBe('Ir. Budi Santoso, MT')
    expect(result.previewKeyPersons[0].whatsapp).toBe('81288992211')
    expect(result.previewKeyPersons[0].countryCode).toBe('62')
  })

  it('executeImport should execute batch import orchestrating customer repo and contact usecase', async () => {
    const templateBuffer = await generateTemplate(deps)
    const execResult = await executeImport(deps, { file: templateBuffer, mode: 'upsert' })

    expect(execResult.createdCustomers).toBe(1)
    expect(execResult.createdKeyPersons).toBe(1)
    expect(mockRepo.create).toHaveBeenCalled()
    expect(mockContactUsecase.create).toHaveBeenCalled()
  })
})
