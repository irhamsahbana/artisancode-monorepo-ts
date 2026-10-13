import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUserUsecase } from '@/contracts/user.contract'

import { createUserHandler } from '../user.handler'

describe('UserHandler - login', () => {
  const mockUsecase = {
    login: mock(async () => ({
      user: { id: 'u-1', username: 'admin', email: 'admin@crm.com' },
      tokens: { access_token: 'acc-token', refresh_token: 'ref-token' },
    })),
  } as unknown as IUserUsecase

  const handler = createUserHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/login', (c) => {
    c.set('body', { username: 'admin', password: 'password' } as any)
    return handler.login(c)
  })

  it('should return 200 with tokens and user on login', async () => {
    const res = await app.request('/login', { method: 'POST' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.user.id).toBe('u-1')
    expect(json.data.tokens.access_token).toBe('acc-token')
    expect(mockUsecase.login).toHaveBeenCalled()
  })
})
