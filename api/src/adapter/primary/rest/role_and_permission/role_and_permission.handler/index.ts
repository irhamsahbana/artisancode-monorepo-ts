import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IRoleAndPermissionUsecase } from '@/contracts/role_and_permission.contract'

import { createRoleHandler as makeCreateRole } from './create-role'
import { deleteRoleHandler as makeDeleteRole } from './delete-role'
import { findPermissionListHandler as makeFindPermissionList } from './find-permission-list'
import { findRoleByIdHandler as makeFindRoleById } from './find-role-by-id'
import { findRoleListHandler as makeFindRoleList } from './find-role-list'
import { updateRoleHandler as makeUpdateRole } from './update-role'

export function createRoleAndPermissionHandlerDeps(usecase: IRoleAndPermissionUsecase) {
  const handlers = {
    createRole: makeCreateRole(usecase),
    findRoleList: makeFindRoleList(usecase),
    findRoleById: makeFindRoleById(usecase),
    updateRole: makeUpdateRole(usecase),
    deleteRole: makeDeleteRole(usecase),
    findPermissionList: makeFindPermissionList(usecase),
  }

  return {
    createRole: (c: Context<AppEnv>) =>
      withSpan('RoleAndPermissionHandler.createRole', () => handlers.createRole(c)),
    findRoleList: (c: Context<AppEnv>) =>
      withSpan('RoleAndPermissionHandler.findRoleList', () => handlers.findRoleList(c)),
    findRoleById: (c: Context<AppEnv>) =>
      withSpan('RoleAndPermissionHandler.findRoleById', () => handlers.findRoleById(c)),
    updateRole: (c: Context<AppEnv>) =>
      withSpan('RoleAndPermissionHandler.updateRole', () => handlers.updateRole(c)),
    deleteRole: (c: Context<AppEnv>) =>
      withSpan('RoleAndPermissionHandler.deleteRole', () => handlers.deleteRole(c)),
    findPermissionList: (c: Context<AppEnv>) =>
      withSpan('RoleAndPermissionHandler.findPermissionList', () => handlers.findPermissionList(c)),
  }
}

export { createRoleAndPermissionHandlerDeps as createRoleAndPermissionHandler }
