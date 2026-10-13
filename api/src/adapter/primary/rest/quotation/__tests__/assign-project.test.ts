import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IQuotationUsecase } from '@/contracts/quotation.contract'
import * as Entity from '@/entities/quotation.entity'

import { createQuotationHandler } from '../quotation.handler'

describe('QuotationHandler - assignProject', () => {
  const mockQuotation: Entity.QuotationRequest = {
    id: 'q-1',
    title: 'RFQ Pengecoran',
    projectId: 'proj-1',
    topic: null,
    requesterName: 'Budi Santoso',
    companyName: 'PT Wika',
    whatsapp: '08123456789',
    email: 'budi@wika.com',
    products: [],
    notes: null,
    status: 'responded',
    createdAt: new Date(),
  }

  const mockUsecase = {
    assignProject: mock(async () => mockQuotation),
  } as unknown as IQuotationUsecase

  const handler = createQuotationHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.put('/:id/assign', (c) => {
    c.set('body', { projectId: 'proj-1' } as any)
    return handler.assignProject(c)
  })

  it('should return 200 after assigning quotation to project', async () => {
    const res = await app.request('/q-1/assign', { method: 'PUT' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.project_id).toBe('proj-1')
    expect(mockUsecase.assignProject).toHaveBeenCalled()
  })
})
