import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'
import * as Entity from '@/entities/whatsapp_login.entity'

import { createWhatsAppLoginHandler } from '../whatsapp_login.handler'

describe('WhatsAppLoginHandler - request', () => {
  const mockRes: Entity.RequestWhatsAppLoginRes = {
    requestId: 'req-1',
    confirmMessage: 'LOGIN 1234ABCD. Kirim pesan ini tanpa mengubah isinya.',
    businessWhatsapp: '6281234567890',
  }

  const mockUsecase = {
    request: mock(async () => mockRes),
  } as unknown as IWhatsAppLoginUsecase

  const handler = createWhatsAppLoginHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', { phone: '6281234567890' } as any)
    return handler.request(c)
  })

  it('should return 200 with whatsapp login request result', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.request_id).toBe('req-1')
    expect(json.data.confirm_message).toBe('LOGIN 1234ABCD. Kirim pesan ini tanpa mengubah isinya.')
    expect(mockUsecase.request).toHaveBeenCalledWith({ phone: '6281234567890' })
  })
})
