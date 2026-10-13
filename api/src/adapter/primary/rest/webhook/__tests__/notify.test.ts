import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import type { CheckStatusRes } from '@/contracts/integration/payment.contract'
import { IWebhookUsecase } from '@/contracts/webhook.contract'

import { createWebhookHandler } from '../webhook.handler'

describe('WebhookHandler - notify', () => {
  const mockResult: CheckStatusRes = {
    order: { invoice_number: 'INV-001', amount: 100000 },
    transaction: { status: 'SUCCESS', date: '2026-03-01' },
  }

  const mockUsecase = {
    processPaymentNotification: mock(async () => mockResult),
  } as unknown as IWebhookUsecase

  const handler = createWebhookHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/notify', (c) => handler.notify(c))

  it('should return 200 with payment notification result', async () => {
    const res = await app.request('/notify', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-signature': 'sig123',
      },
      body: JSON.stringify({ order: { invoice_number: 'INV-001' } }),
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.order.invoice_number).toBe('INV-001')
    expect(mockUsecase.processPaymentNotification).toHaveBeenCalled()
  })
})
