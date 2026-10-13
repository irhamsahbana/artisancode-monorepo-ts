import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IQuotationUsecase } from '@/contracts/quotation.contract'
import * as Entity from '@/entities/quotation.entity'

import { createQuotationHandler } from '../quotation.handler'

describe('QuotationHandler - updateStatus', () => {
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
    status: 'in_review',
    createdAt: new Date(),
  }

  const mockUsecase = {
    updateStatus: mock(async () => mockQuotation),
  } as unknown as IQuotationUsecase

  const handler = createQuotationHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.put('/:id/status', (c) => {
    c.set('body', { status: 'in_review' } as any)
    return handler.updateStatus(c)
  })

  it('should return 200 with updated quotation status', async () => {
    const res = await app.request('/q-1/status', { method: 'PUT' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.status).toBe('in_review')
    expect(mockUsecase.updateStatus).toHaveBeenCalled()
  })
})
