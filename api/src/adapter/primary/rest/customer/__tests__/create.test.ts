import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { ICustomerUsecase } from '@/contracts/customer.contract'
import * as Entity from '@/entities/customer.entity'

import { createCustomerHandler } from '../customer.handler'

describe('CustomerHandler - create', () => {
  const mockCustomer: Entity.Customer = {
    id: 'cust-1',
    name: 'PT Wika Beton',
    categoryId: null,
    segmentationId: null,
    areaId: null,
    status: 'active',
    potential: 'high',
    hasContractHistory: false,
    lastRevenue: null,
    lastContractYear: null,
    companyType: 'bumn',
    address: 'Jakarta',
    npwp: null,
    skt: null,
    companyEmail: 'info@wikabeton.com',
    phone: null,
    fax: null,
    phoneCountryCode: '62',
    faxCountryCode: '62',
    website: null,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }

  const mockUsecase: ICustomerUsecase = {
    create: mock(async () => mockCustomer),
    findById: mock(async () => mockCustomer),
    findList: mock(async () => ({
      items: [mockCustomer],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
    update: mock(async () => mockCustomer),
    delete: mock(async () => {}),
    generateTemplate: mock(async () => Buffer.from('')),
    dryRunImport: mock(async () => ({}) as any),
    executeImport: mock(async () => ({}) as any),
  }

  const handler = createCustomerHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', { name: 'PT Wika Beton', email: 'info@wikabeton.com' } as any)
    return handler.create(c)
  })

  it('should return 201 with created customer', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('cust-1')
    expect(mockUsecase.create).toHaveBeenCalled()
  })
})
