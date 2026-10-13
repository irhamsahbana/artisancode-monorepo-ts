import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'

import { createWhatsappHandler } from '../whatsapp.handler'

describe('WhatsAppHandler - webhook', () => {
  const mockUsecase = {
    confirmByIncomingMessage: mock(async () => {}),
  } as unknown as IWhatsAppLoginUsecase

  const handler = createWhatsappHandler(mockUsecase, {} as any)
  const app = new Hono<AppEnv>()
  app.post('/webhook', (c) => handler.webhook(c))

  it('should handle incoming webhook direct text message', async () => {
    const payload = {
      event: 'message',
      payload: {
        from: '6281234567890@s.whatsapp.net',
        chat_id: '6281234567890@s.whatsapp.net',
        body: 'LOGIN 1234ABCD',
        is_from_me: false,
      },
    }

    const res = await app.request('/webhook', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.confirmByIncomingMessage).toHaveBeenCalledWith('6281234567890', 'LOGIN 1234ABCD')
  })
})
