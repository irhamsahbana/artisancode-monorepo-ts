import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/user.entity'

import { UserUsecaseDeps } from '../user.usecase'

export async function updateUser(
  deps: UserUsecaseDeps,
  req: Entity.UpdateUserReq,
): Promise<Entity.User> {
  const existing = await deps.repo.findById(req.id)
  if (!existing) {
    throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
  }
  return deps.repo.update(req)
}
