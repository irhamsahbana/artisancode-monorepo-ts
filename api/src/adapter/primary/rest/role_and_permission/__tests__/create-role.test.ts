import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IRoleAndPermissionUsecase } from '@/contracts/role_and_permission.contract'
import * as Entity from '@/entities/role.entity'

import { createRoleAndPermissionHandler } from '../role_and_permission.handler'

describe('RoleAndPermissionHandler - createRole', () => {
  const mockRole: Entity.Role = {
    id: 'role-1',
    name: 'Sales Admin',
    description: 'Administrator sales',
    isSystem: false,
    permissions: ['customers.create', 'customers.view'],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    createRole: mock(async () => mockRole),
    findRoleList: mock(async () => [mockRole]),
    findRoleById: mock(async () => mockRole),
    updateRole: mock(async () => mockRole),
    deleteRole: mock(async () => {}),
    findPermissionList: mock(async () => []),
  } as unknown as IRoleAndPermissionUsecase

  const handler = createRoleAndPermissionHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/roles', (c) => {
    c.set('body', { name: 'Sales Admin', permissions: ['customers.view'] } as any)
    return handler.createRole(c)
  })

  it('should return 201 with created role', async () => {
    const res = await app.request('/roles', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('role-1')
    expect(mockUsecase.createRole).toHaveBeenCalled()
  })
})
