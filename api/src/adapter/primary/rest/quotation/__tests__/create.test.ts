import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IQuotationUsecase } from '@/contracts/quotation.contract'
import * as Entity from '@/entities/quotation.entity'

import { createQuotationHandler } from '../quotation.handler'

describe('QuotationHandler - create', () => {
  const mockQuotation: Entity.QuotationRequest = {
    id: 'q-1',
    title: 'RFQ Pengecoran Proyek Tol',
    projectId: null,
    topic: null,
    requesterName: 'Budi Santoso',
    companyName: 'PT Wika',
    whatsapp: '08123456789',
    email: 'budi@wika.com',
    products: [{ productName: 'Beton K-300', specification: 'Fast dry', quantity: '50 m3' }],
    notes: null,
    status: 'new',
    createdAt: new Date(),
  }

  const mockUsecase = {
    create: mock(async () => mockQuotation),
    findById: mock(async () => mockQuotation),
    findList: mock(async () => ({
      items: [mockQuotation],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
    updateStatus: mock(async () => mockQuotation),
    assignProject: mock(async () => mockQuotation),
  } as unknown as IQuotationUsecase

  const handler = createQuotationHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', {
      requesterName: 'Budi Santoso',
      companyName: 'PT Wika',
      whatsapp: '08123456789',
    } as any)
    return handler.create(c)
  })

  it('should return 201 with created quotation', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('q-1')
    expect(mockUsecase.create).toHaveBeenCalled()
  })
})
