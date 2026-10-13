import { AppEnv, AppError } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { ICustomerUsecase } from '@/contracts/customer.contract'
import * as Entity from '@/entities/customer.entity'

import { createCustomerHandler } from '../customer.handler'

describe('CustomerHandler - executeImport', () => {
  const mockExecuteResult: Entity.CustomerImportExecuteResult = {
    createdCustomers: 1,
    updatedCustomers: 0,
    createdKeyPersons: 1,
    skippedCustomers: 0,
    errors: [],
  }

  const mockUsecase: ICustomerUsecase = {
    create: mock(async () => ({}) as any),
    findById: mock(async () => ({}) as any),
    findList: mock(async () => ({}) as any),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
    generateTemplate: mock(async () => Buffer.from('')),
    dryRunImport: mock(async () => ({}) as any),
    executeImport: mock(async () => mockExecuteResult),
  }

  const handler = createCustomerHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json({ success: false, message: err.message }, 400)
    }
    return c.json({ success: false, message: 'Internal server error' }, 500)
  })
  app.post('/import', handler.executeImport)

  it('should execute import with uploaded excel file and mode', async () => {
    const formData = new FormData()
    const dummyBlob = new Blob(['sample-excel-content'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    formData.append('file', dummyBlob, 'customers.xlsx')
    formData.append('mode', 'upsert')

    const res = await app.request('/import', {
      method: 'POST',
      body: formData,
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.created_customers).toBe(1)
    expect(json.data.created_key_persons).toBe(1)
    expect(mockUsecase.executeImport).toHaveBeenCalled()
  })

  it('should reject when file is not provided', async () => {
    const formData = new FormData()

    const res = await app.request('/import', {
      method: 'POST',
      body: formData,
    })

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})
