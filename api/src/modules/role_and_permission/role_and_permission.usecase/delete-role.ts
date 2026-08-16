import { AppError, ErrorCode } from '@artisancode/types'

import { RoleAndPermissionUsecaseDeps } from '../role_and_permission.usecase'

export async function deleteRole(deps: RoleAndPermissionUsecaseDeps, id: string): Promise<void> {
  const existing = await deps.repo.findRoleById(id)
  if (!existing) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Role not found')
  }
  await deps.repo.deleteRole(id)
}
