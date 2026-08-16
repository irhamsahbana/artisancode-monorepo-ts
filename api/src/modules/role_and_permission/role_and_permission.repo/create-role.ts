import { getExecutor } from '@/common/executor'
import { rolePermissions, roles } from '@/db/schema'
import * as Entity from '@/entities/role.entity'

import { RoleAndPermissionRepoDeps } from '../role_and_permission.repo'
import { findRoleById } from './find-by-id'
import { findPermissionIdsByNames } from './find-permission-ids-by-names'

export async function createRole(
  deps: RoleAndPermissionRepoDeps,
  req: Entity.CreateRoleReq,
): Promise<Entity.Role> {
  const [role] = await getExecutor()
    .insert(roles)
    .values({
      name: req.name,
      description: req.description || '',
    })
    .returning()

  if (req.permissions && req.permissions.length > 0) {
    const permissionIds = await findPermissionIdsByNames(req.permissions)
    await getExecutor()
      .insert(rolePermissions)
      .values(permissionIds.map((permissionId) => ({ roleId: role.id, permissionId })))
  }

  return findRoleById(deps, role.id) as Promise<Entity.Role>
}
