import { eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { rolePermissions, roles } from '@/db/schema'
import * as Entity from '@/entities/role.entity'

import { findRoleById } from './find-by-id'
import { findPermissionIdsByNames } from './find-permission-ids-by-names'
import { RoleAndPermissionRepoDeps } from '../role_and_permission.repo'

export async function updateRole(
  deps: RoleAndPermissionRepoDeps,
  req: Entity.UpdateRoleReq,
): Promise<Entity.Role> {
  const { id, permissions, ...rest } = req

  if (permissions) {
    await getExecutor().delete(rolePermissions).where(eq(rolePermissions.roleId, id))

    if (permissions.length > 0) {
      const permissionIds = await findPermissionIdsByNames(permissions)
      await getExecutor()
        .insert(rolePermissions)
        .values(permissionIds.map((permissionId) => ({ roleId: id, permissionId })))
    }
  }

  await getExecutor().update(roles).set(rest).where(eq(roles.id, id))

  return findRoleById(deps, id) as Promise<Entity.Role>
}
