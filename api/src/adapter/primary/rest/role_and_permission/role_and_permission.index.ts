import { Hono } from 'hono'

import { createRoleAndPermissionRepo } from '@/adapter/secondary/repository/role_and_permission/role_and_permission.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createRoleAndPermissionUsecase } from '@/modules/role_and_permission/role_and_permission.usecase'

import { createRoleAndPermissionHandlerDeps } from './role_and_permission.handler'
import * as Schema from './role_and_permission.schema'

// Re-export error codes for external consumers

const repo = createRoleAndPermissionRepo()
const usecase = createRoleAndPermissionUsecase(repo)
const handler = createRoleAndPermissionHandlerDeps(usecase)

const roleRouter = new Hono()
const permissionRouter = new Hono()

// Role Routes
roleRouter.post(
  '/',
  authenticate,
  requirePermission('roles.create'),
  validate(Schema.createRoleSchema),
  handler.createRole,
)
roleRouter.get(
  '/',
  authenticate,
  requirePermission('roles.view'),
  validateQuery(Schema.getRoleListSchema),
  handler.findRoleList,
)
roleRouter.get('/:id', authenticate, requirePermission('roles.view'), handler.findRoleById)
roleRouter.put(
  '/:id',
  authenticate,
  requirePermission('roles.update'),
  validate(Schema.updateRoleSchema),
  handler.updateRole,
)
roleRouter.delete('/:id', authenticate, requirePermission('roles.delete'), handler.deleteRole)

// Permission Routes — gated by roles.view since the catalog is only ever
// consumed while building/editing a role's permission grid.
permissionRouter.get(
  '/',
  authenticate,
  requirePermission('roles.view'),
  validateQuery(Schema.getPermissionListSchema),
  handler.findPermissionList,
)

export default roleRouter
export { permissionRouter }
