import { Hono } from 'hono'

import { createRoleAndPermissionRepo } from '@/adapter/secondary/repository/role_and_permission/role_and_permission.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createRoleAndPermissionUsecase } from '@/modules/role_and_permission/role_and_permission.usecase'

import { createRoleAndPermissionHandlerDeps } from './role_and_permission.handler'
import * as Schema from './role_and_permission.schema'

// Re-export error codes for external consumers

const repo = createRoleAndPermissionRepo()
const usecase = createRoleAndPermissionUsecase(repo)
const handler = createRoleAndPermissionHandlerDeps(usecase)

const router = new Hono()

// Role Routes
router.post('/roles', authenticate, validate(Schema.createRoleSchema), handler.createRole)
router.get('/roles', authenticate, validateQuery(Schema.getRoleListSchema), handler.findRoleList)
router.get('/roles/:id', authenticate, handler.findRoleById)
router.put('/roles/:id', authenticate, validate(Schema.updateRoleSchema), handler.updateRole)
router.delete('/roles/:id', authenticate, handler.deleteRole)

// Permission Routes
router.get(
  '/permissions',
  authenticate,
  validateQuery(Schema.getPermissionListSchema),
  handler.findPermissionList,
)

export default router
