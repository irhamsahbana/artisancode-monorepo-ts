import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBirthdayGreetingUsecase } from '@/contracts/birthday_greeting.contract'
import * as Entity from '@/entities/birthday_greeting.entity'

import { createBirthdayGreetingHandler } from '../birthday_greeting.handler'

describe('BirthdayGreetingHandler - findLogs', () => {
  const mockLog: Entity.BirthdayGreetingLog = {
    id: 'bgl-1',
    sentAt: new Date(),
    recipientCount: 5,
    recipientLogs: [],
  }

  const mockUsecase = {
    findLogs: mock(async () => [mockLog]),
  } as unknown as IBirthdayGreetingUsecase

  const handler = createBirthdayGreetingHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/logs', (c) => handler.findLogs(c))

  it('should return 200 with birthday greeting logs', async () => {
    const res = await app.request('/logs')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].id).toBe('bgl-1')
    expect(mockUsecase.findLogs).toHaveBeenCalled()
  })
})
