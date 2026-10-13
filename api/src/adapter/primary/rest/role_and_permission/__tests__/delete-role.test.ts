import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IRoleAndPermissionUsecase } from '@/contracts/role_and_permission.contract'

import { createRoleAndPermissionHandler } from '../role_and_permission.handler'

describe('RoleAndPermissionHandler - deleteRole', () => {
  const mockUsecase = {
    deleteRole: mock(async () => {}),
  } as unknown as IRoleAndPermissionUsecase

  const handler = createRoleAndPermissionHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.delete('/roles/:id', handler.deleteRole)

  it('should return 200 after deleting role', async () => {
    const res = await app.request('/roles/role-1', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.deleteRole).toHaveBeenCalledWith('role-1')
  })
})
