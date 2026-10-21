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
      companyType: req.companyType ?? null,
      address: req.address ?? null,
      npwp: req.npwp ?? null,
      skt: req.skt ?? null,
      companyEmail: req.companyEmail ?? null,
      phone: req.phone ?? null,
      fax: req.fax ?? null,
      phoneCountryCode: req.phoneCountryCode ?? '62',
      faxCountryCode: req.faxCountryCode ?? '62',
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
      companyType: req.companyType ?? null,
      address: req.address ?? null,
      npwp: req.npwp ?? null,
      skt: req.skt ?? null,
      companyEmail: req.companyEmail ?? null,
      phone: req.phone ?? null,
      fax: req.fax ?? null,
      phoneCountryCode: req.phoneCountryCode ?? '62',
      faxCountryCode: req.faxCountryCode ?? '62',
      website: req.website ?? null,
      notes: req.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })),
    delete: mock(async () => {}),
    findCustomersByNames: mock(async () => []),
    createMany: mock(async (reqs) => Promise.all(reqs.map((r: any) => mockRepo.create(r)))),
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
      landline: req.landline ?? null,
      landlineCountryCode: req.landline_country_code ?? '62',
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
    createMany: mock(async (reqs) =>
      Promise.all(reqs.map((r: any) => mockContactUsecase.create(r))),
    ),
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
    expect(result.previewCustomers[0].phone).toBe('218093333')
    expect(result.previewCustomers[0].fax).toBe('218093334')
    expect(result.previewKeyPersons[0].landline).toBe('218093333')
    expect(result.previewCustomers[0].phoneCountryCode).toBe('62')
    expect(result.previewCustomers[0].faxCountryCode).toBe('62')
    expect(result.previewKeyPersons[0].landlineCountryCode).toBe('62')
  })

  it('dryRunImport should read per-number country codes and reject unknown ones', async () => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load((await generateTemplate(deps)) as any)
    const customers = workbook.getWorksheet('Data Customer') as ExcelJS.Worksheet
    const keyPersons = workbook.getWorksheet('Data Key Person') as ExcelJS.Worksheet
    const col = (sheet: ExcelJS.Worksheet, name: string) =>
      (sheet.getRow(1).values as string[]).indexOf(name)

    customers.getRow(2).getCell(col(customers, 'Kode Negara Telepon')).value = '+65'
    customers.getRow(2).getCell(col(customers, 'Kode Negara Fax')).value = null // blank = 62
    keyPersons.getRow(2).getCell(col(keyPersons, 'Kode Negara Telepon Tetap')).value = 60
    const ok = await dryRunImport(deps, Buffer.from(await workbook.xlsx.writeBuffer()))
    expect(ok.errors).toEqual([])
    expect(ok.previewCustomers[0].phoneCountryCode).toBe('65')
    expect(ok.previewCustomers[0].faxCountryCode).toBe('62')
    expect(ok.previewKeyPersons[0].landlineCountryCode).toBe('60')

    keyPersons.getRow(2).getCell(col(keyPersons, 'Kode Negara WhatsApp')).value = '999'
    const bad = await dryRunImport(deps, Buffer.from(await workbook.xlsx.writeBuffer()))
    expect(bad.validKeyPersons).toBe(0)
    expect(bad.errors[0].field).toBe('Kode Negara WhatsApp')
  })

  it('dryRunImport should accept a key person with only Telepon Tetap and reject one with neither number', async () => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load((await generateTemplate(deps)) as any)
    const sheet = workbook.getWorksheet('Data Key Person') as ExcelJS.Worksheet
    const header = (name: string) => (sheet.getRow(1).values as string[]).indexOf(name)
    const waCol = header('Nomor WhatsApp *')
    const landlineCol = header('Telepon Tetap *')

    sheet.getRow(2).getCell(waCol).value = null // landline only
    const landlineOnly = await dryRunImport(deps, Buffer.from(await workbook.xlsx.writeBuffer()))
    expect(landlineOnly.errors).toEqual([])
    expect(landlineOnly.previewKeyPersons[0].whatsapp).toBeUndefined()
    expect(landlineOnly.previewKeyPersons[0].landline).toBe('218093333')

    sheet.getRow(2).getCell(landlineCol).value = null // neither
    const neither = await dryRunImport(deps, Buffer.from(await workbook.xlsx.writeBuffer()))
    expect(neither.validKeyPersons).toBe(0)
    expect(neither.errors[0].field).toBe('Nomor WhatsApp / Telepon Tetap')
  })

  it('dryRunImport should map Tipe Perusahaan "Perorangan" to perorangan', async () => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load((await generateTemplate(deps)) as any)
    const sheet = workbook.getWorksheet('Data Customer') as ExcelJS.Worksheet
    const typeCol = (sheet.getRow(1).values as string[]).indexOf('Tipe Perusahaan')
    sheet.getRow(2).getCell(typeCol).value = 'Perorangan'

    const result = await dryRunImport(deps, Buffer.from(await workbook.xlsx.writeBuffer()))
    expect(result.errors).toEqual([])
    expect(result.previewCustomers[0].companyType).toBe('perorangan')
  })

  it('executeImport should execute batch import orchestrating customer repo and contact usecase', async () => {
    const templateBuffer = await generateTemplate(deps)
    const execResult = await executeImport(deps, { file: templateBuffer, mode: 'upsert' })

    expect(execResult.createdCustomers).toBe(1)
    expect(execResult.createdKeyPersons).toBe(1)
    // batch path: one createMany per entity type; "Kontak Penting?" lands on the contact itself
    expect(mockRepo.createMany).toHaveBeenCalledTimes(1)
    expect(mockContactUsecase.createMany).toHaveBeenCalledTimes(1)
    const contactReqs = (mockContactUsecase.createMany as ReturnType<typeof mock>).mock.calls[0][0]
    expect(contactReqs[0].isPrimary).toBe(true)
  })
})
