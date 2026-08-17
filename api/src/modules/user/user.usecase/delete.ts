import { AppError, ErrorCode } from '@artisancode/types'

import { UserUsecaseDeps } from '../user.usecase'

export async function deleteUser(
  deps: UserUsecaseDeps,
  id: string,
  requestedById: string,
): Promise<void> {
  const existing = await deps.repo.findById(id)
  if (!existing) {
    throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
  }
  if (existing.isProtected) {
    throw new AppError(ErrorCode.FORBIDDEN, 'This user is protected and cannot be deleted')
  }
  if (existing.id === requestedById) {
    throw new AppError(ErrorCode.FORBIDDEN, 'You cannot delete your own account')
  }
  await deps.repo.delete(id)
}
