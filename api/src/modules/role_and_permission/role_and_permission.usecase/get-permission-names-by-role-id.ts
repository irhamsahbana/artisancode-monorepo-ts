import {
  getCachedPermissions,
  setCachedPermissions,
} from '@/adapter/secondary/cache/permissions-cache'

import { RoleAndPermissionUsecaseDeps } from '../role_and_permission.usecase'

export async function getPermissionNamesByRoleId(
  deps: RoleAndPermissionUsecaseDeps,
  roleId: string,
): Promise<string[]> {
  const cached = await getCachedPermissions(roleId)
  if (cached) return cached

  const names = await deps.repo.findPermissionNamesByRoleId(roleId)
  await setCachedPermissions(roleId, names)
  return names
}
