import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IQuotationUsecase } from '@/contracts/quotation.contract'
import * as Entity from '@/entities/quotation.entity'

import { createQuotationHandler } from '../quotation.handler'

describe('QuotationHandler - findList', () => {
  const mockQuotation: Entity.QuotationRequest = {
    id: 'q-1',
    title: 'RFQ Pengecoran',
    projectId: null,
    topic: null,
    requesterName: 'Budi Santoso',
    companyName: 'PT Wika',
    whatsapp: '08123456789',
    email: 'budi@wika.com',
    products: [],
    notes: null,
    status: 'new',
    createdAt: new Date(),
  }

  const mockUsecase = {
    findList: mock(async () => ({
      items: [mockQuotation],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
  } as unknown as IQuotationUsecase

  const handler = createQuotationHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', handler.findList)

  it('should return 200 with quotation list', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.items.length).toBe(1)
    expect(mockUsecase.findList).toHaveBeenCalled()
  })
})
