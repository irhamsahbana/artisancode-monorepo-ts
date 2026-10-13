import crypto from 'crypto'

import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { env } from '@/config/env'
import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'

import { createWhatsappHandler } from '../whatsapp.handler'

describe('WhatsAppHandler - webhook', () => {
  it('should handle incoming webhook direct text message with signature', async () => {
    const mockUsecase = {
      confirmByIncomingMessage: mock(async () => {}),
    } as unknown as IWhatsAppLoginUsecase

    const handler = createWhatsappHandler(mockUsecase, {} as any)
    const app = new Hono<AppEnv>()
    app.post('/webhook', (c) => handler.webhook(c))

    const secret = env.GOWA.WEBHOOK_SECRET || 'test-secret'
    const payload = {
      event: 'message',
      payload: {
        from: '6281234567890@s.whatsapp.net',
        chat_id: '6281234567890@s.whatsapp.net',
        body: 'LOGIN 1234ABCD',
        is_from_me: false,
      },
    }
    const rawBody = JSON.stringify(payload)
    const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

    const res = await app.request('/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-hub-signature-256': signature,
      },
      body: rawBody,
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.confirmByIncomingMessage).toHaveBeenCalledWith(
      '6281234567890',
      'LOGIN 1234ABCD',
    )
  })

  it('should handle incoming webhook with instruction message format', async () => {
    const mockUsecase = {
      confirmByIncomingMessage: mock(async () => {}),
    } as unknown as IWhatsAppLoginUsecase

    const handler = createWhatsappHandler(mockUsecase, {} as any)
    const app = new Hono<AppEnv>()
    app.post('/webhook', (c) => handler.webhook(c))

    const secret = env.GOWA.WEBHOOK_SECRET || 'test-secret'
    const payload = {
      event: 'message',
      payload: {
        from: '6281234567890@s.whatsapp.net',
        chat_id: '6281234567890@s.whatsapp.net',
        body: 'LOGIN 1234ABCD. Kirim pesan ini tanpa mengubah isinya.',
        is_from_me: false,
      },
    }
    const rawBody = JSON.stringify(payload)
    const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

    const res = await app.request('/webhook', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-hub-signature-256': signature,
      },
      body: rawBody,
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.confirmByIncomingMessage).toHaveBeenCalledWith(
      '6281234567890',
      'LOGIN 1234ABCD. Kirim pesan ini tanpa mengubah isinya.',
    )
  })
})
