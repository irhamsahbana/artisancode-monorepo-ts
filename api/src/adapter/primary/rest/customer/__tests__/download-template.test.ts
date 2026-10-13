import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { ICustomerUsecase } from '@/contracts/customer.contract'

import { createCustomerHandler } from '../customer.handler'

describe('CustomerHandler - downloadTemplate', () => {
  const dummyBuffer = Buffer.from('mock-excel-binary-data')

  const mockUsecase: ICustomerUsecase = {
    create: mock(async () => ({}) as any),
    findById: mock(async () => ({}) as any),
    findList: mock(async () => ({}) as any),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
    generateTemplate: mock(async () => dummyBuffer),
    dryRunImport: mock(async () => ({}) as any),
    executeImport: mock(async () => ({}) as any),
  }

  const handler = createCustomerHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/template', handler.downloadTemplate)

  it('should return 200 with Excel content-type and disposition header', async () => {
    const res = await app.request('/template', { method: 'GET' })
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    expect(res.headers.get('content-disposition')).toContain('attachment')
    expect(res.headers.get('content-disposition')).toContain(
      'template_import_customer_crm_wika.xlsx',
    )
    expect(mockUsecase.generateTemplate).toHaveBeenCalled()
  })
})
