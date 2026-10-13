import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { ICustomerUsecase } from '@/contracts/customer.contract'

import { createCustomerHandler } from '../customer.handler'

describe('CustomerHandler - delete', () => {
  const mockUsecase: ICustomerUsecase = {
    create: mock(async () => ({}) as any),
    findById: mock(async () => ({}) as any),
    findList: mock(async () => ({
      items: [],
      pagination: { total: 0, page: 1, per_page: 10, last_page: 1 },
    })),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
    generateTemplate: mock(async () => Buffer.from('')),
    dryRunImport: mock(async () => ({}) as any),
    executeImport: mock(async () => ({}) as any),
  }

  const handler = createCustomerHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.delete('/:id', handler.delete)

  it('should return 200 after deleting customer', async () => {
    const res = await app.request('/cust-1', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.delete).toHaveBeenCalledWith('cust-1')
  })
})
