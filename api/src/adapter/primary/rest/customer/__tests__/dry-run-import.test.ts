import { AppEnv, AppError } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { ICustomerUsecase } from '@/contracts/customer.contract'
import * as Entity from '@/entities/customer.entity'

import { createCustomerHandler } from '../customer.handler'

describe('CustomerHandler - dryRunImport', () => {
  const mockDryRunResult: Entity.CustomerImportDryRunResult = {
    totalCustomers: 2,
    validCustomers: 2,
    totalKeyPersons: 2,
    validKeyPersons: 2,
    errors: [],
    previewCustomers: [
      {
        rowNumber: 2,
        name: 'PT Wijaya Karya',
        companyType: 'bumn',
        status: 'active',
        potential: 'high',
      },
    ],
    previewKeyPersons: [
      {
        rowNumber: 2,
        customerName: 'PT Wijaya Karya',
        name: 'Budi Santoso',
        whatsapp: '81234567890',
        countryCode: '62',
      },
    ],
  }

  const mockUsecase: ICustomerUsecase = {
    create: mock(async () => ({}) as any),
    findById: mock(async () => ({}) as any),
    findList: mock(async () => ({}) as any),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
    generateTemplate: mock(async () => Buffer.from('')),
    dryRunImport: mock(async () => mockDryRunResult),
    executeImport: mock(async () => ({}) as any),
  }

  const handler = createCustomerHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json({ success: false, message: err.message }, 400)
    }
    return c.json({ success: false, message: 'Internal server error' }, 500)
  })
  app.post('/import/dry-run', handler.dryRunImport)

  it('should parse uploaded excel file and return dry-run validation result', async () => {
    const formData = new FormData()
    const dummyBlob = new Blob(['sample-excel-content'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    formData.append('file', dummyBlob, 'customers.xlsx')

    const res = await app.request('/import/dry-run', {
      method: 'POST',
      body: formData,
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.total_customers).toBe(2)
    expect(json.data.valid_customers).toBe(2)
    expect(mockUsecase.dryRunImport).toHaveBeenCalled()
  })

  it('should reject when file is not provided', async () => {
    const formData = new FormData()

    const res = await app.request('/import/dry-run', {
      method: 'POST',
      body: formData,
    })

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})
