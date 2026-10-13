import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBroadcastUsecase } from '@/contracts/broadcast.contract'
import * as Entity from '@/entities/broadcast.entity'

import { createBroadcastHandler } from '../broadcast.handler'

describe('BroadcastHandler - findLogsByTemplateId', () => {
  const mockLog: Entity.BroadcastLog = {
    id: 'bl-1',
    templateId: 'bt-1',
    sentAt: new Date(),
    recipientCount: 10,
    status: 'sent',
    recipientLogs: [],
  }

  const mockUsecase = {
    findLogsByTemplateId: mock(async () => [mockLog]),
  } as unknown as IBroadcastUsecase

  const handler = createBroadcastHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/templates/:id/logs', (c) => handler.findLogsByTemplateId(c))

  it('should return 200 with broadcast logs by template id', async () => {
    const res = await app.request('/templates/bt-1/logs')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].id).toBe('bl-1')
    expect(mockUsecase.findLogsByTemplateId).toHaveBeenCalledWith('bt-1')
  })
})
