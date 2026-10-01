import { AppError, ErrorCode } from '@artisancode/types'

import { comparePassword } from '@/common/encryption'
import * as Entity from '@/entities/user.entity'

import { UserUsecaseDeps } from '../user.usecase'
import { issueSession } from './issue-session'

export async function loginUser(
  deps: UserUsecaseDeps,
  req: Entity.LoginReq,
): Promise<Entity.LoginRes | null> {
  const user = await deps.repo.findByUsernameForLogin(req.email)
  if (!user) return null

  const isValid = await comparePassword(req.password, user.password)
  if (!isValid) return null

  if (user.status !== 'active') {
    throw new AppError(ErrorCode.FORBIDDEN, 'User account is not active')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...cleanUser } = user

  return issueSession(cleanUser)
}
