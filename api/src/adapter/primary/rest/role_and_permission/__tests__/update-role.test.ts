import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IRoleAndPermissionUsecase } from '@/contracts/role_and_permission.contract'
import * as Entity from '@/entities/role.entity'

import { createRoleAndPermissionHandler } from '../role_and_permission.handler'

describe('RoleAndPermissionHandler - updateRole', () => {
  const mockRole: Entity.Role = {
    id: 'role-1',
    name: 'Sales Manager',
    description: 'Updated description',
    isSystem: false,
    permissions: ['customers.create'],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    updateRole: mock(async () => mockRole),
  } as unknown as IRoleAndPermissionUsecase

  const handler = createRoleAndPermissionHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.put('/roles/:id', (c) => {
    c.set('body', { name: 'Sales Manager' } as any)
    return handler.updateRole(c)
  })

  it('should return 200 with updated role', async () => {
    const res = await app.request('/roles/role-1', { method: 'PUT' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Sales Manager')
    expect(mockUsecase.updateRole).toHaveBeenCalled()
  })
})
