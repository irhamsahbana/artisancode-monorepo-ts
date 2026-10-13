import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IWebhookUsecase, WebhookLog } from '@/contracts/webhook.contract'

import { createWebhookHandler } from '../webhook.handler'

describe('WebhookHandler - findList', () => {
  const mockLog: WebhookLog = {
    id: 'wh-1',
    headers: { 'x-signature': 'sig123' },
    body: '{"foo":"bar"}',
    targetPath: '/api/v1/webhook/notify',
    isValid: true,
    invoiceNumber: 'INV-001',
    paymentStatus: 'SUCCESS',
    errorMessage: undefined,
    createdAt: new Date(),
  }

  const mockUsecase = {
    getWebhookLogs: mock(async () => ({
      items: [mockLog],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
  } as unknown as IWebhookUsecase

  const handler = createWebhookHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', (c) => handler.findList(c))

  it('should return 200 with webhook logs', async () => {
    const res = await app.request('/?page=1&per_page=10&invoiceNumber=INV-001')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.items).toHaveLength(1)
    expect(json.data.items[0].id).toBe('wh-1')
    expect(mockUsecase.getWebhookLogs).toHaveBeenCalledWith({
      invoiceNumber: 'INV-001',
      pagination: { page: 1, per_page: 10 },
    })
  })
})
