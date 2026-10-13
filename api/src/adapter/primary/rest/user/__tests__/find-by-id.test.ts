import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUserUsecase } from '@/contracts/user.contract'

import { createUserHandler } from '../user.handler'

describe('UserHandler - findById', () => {
  const mockUsecase = {
    findById: mock(async () => ({ id: 'u-1', username: 'john' })),
  } as unknown as IUserUsecase

  const handler = createUserHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/:id', handler.findById)

  it('should return 200 with user by id', async () => {
    const res = await app.request('/u-1')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('u-1')
    expect(mockUsecase.findById).toHaveBeenCalledWith('u-1')
  })
})
