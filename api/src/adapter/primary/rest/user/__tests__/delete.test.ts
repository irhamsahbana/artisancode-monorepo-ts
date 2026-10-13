import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUserUsecase } from '@/contracts/user.contract'

import { createUserHandler } from '../user.handler'

describe('UserHandler - delete', () => {
  const mockUsecase = {
    delete: mock(async () => {}),
  } as unknown as IUserUsecase

  const handler = createUserHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.delete('/:id', handler.delete)

  it('should return 200 after deleting user', async () => {
    const res = await app.request('/u-1', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.delete).toHaveBeenCalledWith('u-1', '')
  })
})
