import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUserUsecase } from '@/contracts/user.contract'

import { createUserHandler } from '../user.handler'

describe('UserHandler - update', () => {
  const mockUsecase = {
    update: mock(async () => ({ id: 'u-1', username: 'john-updated' })),
  } as unknown as IUserUsecase

  const handler = createUserHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.put('/:id', (c) => {
    c.set('body', { username: 'john-updated' } as any)
    return handler.update(c)
  })

  it('should return 200 with updated user', async () => {
    const res = await app.request('/u-1', { method: 'PUT' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.username).toBe('john-updated')
    expect(mockUsecase.update).toHaveBeenCalled()
  })
})
