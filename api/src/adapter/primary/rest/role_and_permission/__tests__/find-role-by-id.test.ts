import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IRoleAndPermissionUsecase } from '@/contracts/role_and_permission.contract'
import * as Entity from '@/entities/role.entity'

import { createRoleAndPermissionHandler } from '../role_and_permission.handler'

describe('RoleAndPermissionHandler - findRoleById', () => {
  const mockRole: Entity.Role = {
    id: 'role-1',
    name: 'Sales Admin',
    description: 'Administrator sales',
    isSystem: false,
    permissions: ['customers.create'],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    findRoleById: mock(async () => mockRole),
  } as unknown as IRoleAndPermissionUsecase

  const handler = createRoleAndPermissionHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/roles/:id', handler.findRoleById)

  it('should return 200 with role by id', async () => {
    const res = await app.request('/roles/role-1')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('role-1')
    expect(mockUsecase.findRoleById).toHaveBeenCalledWith('role-1')
  })
})
