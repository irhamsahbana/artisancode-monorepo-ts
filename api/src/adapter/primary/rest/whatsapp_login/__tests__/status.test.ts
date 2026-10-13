import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'
import * as Entity from '@/entities/whatsapp_login.entity'

import { createWhatsAppLoginHandler } from '../whatsapp_login.handler'

describe('WhatsAppLoginHandler - status', () => {
  const mockStatusRes: Entity.WhatsAppLoginStatusRes = {
    pending: false,
    login: {
      id: 'u-1',
      roleId: 'role-1',
      name: 'Admin Wika',
      username: 'admin',
      email: 'admin@wika.co.id',
      phone: '08123456789',
      countryCode: '62',
      status: 'active',
      isProtected: false,
      token: 'token-abc',
      refreshToken: 'refresh-xyz',
      permissions: ['*'],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  }

  const mockUsecase = {
    getStatus: mock(async () => mockStatusRes),
  } as unknown as IWhatsAppLoginUsecase

  const handler = createWhatsAppLoginHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/:id/status', (c) => handler.status(c))

  it('should return 200 with login status', async () => {
    const res = await app.request('/req-1/status')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.pending).toBe(false)
    expect(json.data.login.token).toBe('token-abc')
    expect(mockUsecase.getStatus).toHaveBeenCalledWith('req-1')
  })
})
