import { AppError, ErrorCode } from '@artisancode/types'

import { setCachedRefreshToken } from '@/adapter/secondary/cache/refresh-token-cache'
import { createRoleAndPermissionRepo } from '@/adapter/secondary/repository/role_and_permission/role_and_permission.repo'
import { comparePassword } from '@/common/encryption'
import { generateRefreshToken, generateToken } from '@/common/jwt'
import * as Entity from '@/entities/user.entity'
import { createRoleAndPermissionUsecase } from '@/modules/role_and_permission/role_and_permission.usecase'

import { UserUsecaseDeps } from '../user.usecase'

const roleAndPermissionUsecase = createRoleAndPermissionUsecase(createRoleAndPermissionRepo())

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
  const token = generateToken({
    id: user.id,
    role_id: user.roleId,
    name: user.name,
    username: user.username,
  })
  const refreshToken = generateRefreshToken({ id: user.id })
  await setCachedRefreshToken(refreshToken, user.id)

  const permissions = await roleAndPermissionUsecase.getPermissionNamesByRoleId(user.roleId)

  return {
    token,
    refreshToken,
    permissions,
    ...cleanUser,
  }
}
