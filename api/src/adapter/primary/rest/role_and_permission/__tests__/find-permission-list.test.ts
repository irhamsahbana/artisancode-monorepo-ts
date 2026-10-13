import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IRoleAndPermissionUsecase } from '@/contracts/role_and_permission.contract'

import { createRoleAndPermissionHandler } from '../role_and_permission.handler'

describe('RoleAndPermissionHandler - findPermissionList', () => {
  const mockUsecase = {
    findPermissionList: mock(async () => [
      {
        id: 'perm-1',
        name: 'customers.create',
        description: 'Create customers',
        module: 'customers',
      },
    ]),
  } as unknown as IRoleAndPermissionUsecase

  const handler = createRoleAndPermissionHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/permissions', handler.findPermissionList)

  it('should return 200 with list of permissions', async () => {
    const res = await app.request('/permissions')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.length).toBe(1)
    expect(mockUsecase.findPermissionList).toHaveBeenCalled()
  })
})
