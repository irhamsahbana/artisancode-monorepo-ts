import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

mock.module('@/integrations/whatsapp', () => ({
  getWhatsAppProvider: () => ({
    listDevices: mock(async () => [
      { id: 'dev-1', isPrimary: true, isConnected: true, isLoggedIn: true },
    ]),
  }),
}))

import { createWhatsappHandler } from '../whatsapp.handler'

describe('WhatsAppHandler - listDevices', () => {
  const handler = createWhatsappHandler({} as any, {} as any)
  const app = new Hono<AppEnv>()
  app.get('/devices', (c) => handler.listDevices(c))

  it('should return 200 with list of devices', async () => {
    const res = await app.request('/devices')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].id).toBe('dev-1')
  })
})
