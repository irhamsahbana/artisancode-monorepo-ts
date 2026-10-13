import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUserUsecase } from '@/contracts/user.contract'

import { createUserHandler } from '../user.handler'

describe('UserHandler - create', () => {
  const mockUsecase = {
    create: mock(async () => ({ id: 'u-1', username: 'john', email: 'john@crm.com' })),
  } as unknown as IUserUsecase

  const handler = createUserHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', { username: 'john', email: 'john@crm.com', password: 'secret', role_ids: [] } as any)
    return handler.create(c)
  })

  it('should return 201 with created user', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('u-1')
    expect(mockUsecase.create).toHaveBeenCalled()
  })
})
