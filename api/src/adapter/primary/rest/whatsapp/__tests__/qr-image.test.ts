import { AppEnv } from '@artisancode/types'
import { describe, expect, it } from 'bun:test'
import { Hono } from 'hono'

import { createWhatsappHandler } from '../whatsapp.handler'

describe('WhatsAppHandler - qrImage', () => {
  const handler = createWhatsappHandler({} as any, {} as any)
  const app = new Hono<AppEnv>()
  app.get('/qr-image', (c) => handler.qrImage(c))

  it('should return 400 for invalid qr path', async () => {
    const res = await app.request('/qr-image?path=/invalid/path')
    expect(res.status).toBe(400)
  })
})
