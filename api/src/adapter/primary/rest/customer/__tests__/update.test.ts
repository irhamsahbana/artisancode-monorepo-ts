import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { ICustomerUsecase } from '@/contracts/customer.contract'
import * as Entity from '@/entities/customer.entity'

import { createCustomerHandler } from '../customer.handler'

describe('CustomerHandler - update', () => {
  const mockCustomer: Entity.Customer = {
    id: 'cust-1',
    name: 'PT Wika Beton Tbk',
    categoryId: null,
    segmentationId: null,
    areaId: null,
    status: 'active',
    potential: 'high',
    hasContractHistory: false,
    lastRevenue: null,
    lastContractYear: null,
    primaryContactId: null,
    companyType: 'bumn',
    address: 'Jakarta',
    npwp: null,
    skt: null,
    companyEmail: 'info@wikabeton.com',
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
  app.put('/:id', (c) => {
    c.set('body', { name: 'PT Wika Beton Tbk' } as any)
    return handler.update(c)
  })

  it('should return 200 with updated customer', async () => {
    const res = await app.request('/cust-1', { method: 'PUT' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('PT Wika Beton Tbk')
    expect(mockUsecase.update).toHaveBeenCalled()
  })
})
