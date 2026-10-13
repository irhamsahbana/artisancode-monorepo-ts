import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBusinessProfileRepo } from '@/contracts/business_profile.contract'

import { createWhatsappHandler } from '../whatsapp.handler'

describe('WhatsAppHandler - setPrimaryDevice', () => {
  const mockRepo = {
    update: mock(async () => null),
  } as unknown as IBusinessProfileRepo

  const handler = createWhatsappHandler({} as any, mockRepo)
  const app = new Hono<AppEnv>()
  app.post('/devices/:id/primary', (c) => handler.setPrimaryDevice(c))

  it('should return 200 after setting primary device', async () => {
    const res = await app.request('/devices/dev-1/primary', { method: 'POST' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockRepo.update).toHaveBeenCalledWith({ whatsappDeviceId: 'dev-1' })
  })
})
