import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUserUsecase } from '@/contracts/user.contract'

import { createUserHandler } from '../user.handler'

describe('UserHandler - findList', () => {
  const mockUsecase = {
    findList: mock(async () => ({ items: [{ id: 'u-1', username: 'john' }], pagination: { total: 1, page: 1, per_page: 10 } })),
  } as unknown as IUserUsecase

  const handler = createUserHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', handler.findList)

  it('should return 200 with list of users', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.items.length).toBe(1)
    expect(mockUsecase.findList).toHaveBeenCalled()
  })
})
