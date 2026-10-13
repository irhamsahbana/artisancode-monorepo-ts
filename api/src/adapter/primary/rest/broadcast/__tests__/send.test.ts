import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBroadcastUsecase } from '@/contracts/broadcast.contract'
import * as Entity from '@/entities/broadcast.entity'

import { createBroadcastHandler } from '../broadcast.handler'

describe('BroadcastHandler - send', () => {
  const mockSendRes: Entity.SendBroadcastRes = {
    templateId: 'bt-1',
    recipientCount: 5,
    provider: 'waha',
  }

  const mockUsecase = {
    send: mock(async () => mockSendRes),
  } as unknown as IBroadcastUsecase

  const handler = createBroadcastHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/send', (c) => {
    c.set('body', { templateId: 'bt-1' } as any)
    return handler.send(c)
  })

  it('should return 200 after sending broadcast', async () => {
    const res = await app.request('/send', { method: 'POST' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.template_id).toBe('bt-1')
    expect(json.data.recipient_count).toBe(5)
    expect(mockUsecase.send).toHaveBeenCalledWith({ templateId: 'bt-1' })
  })
})
