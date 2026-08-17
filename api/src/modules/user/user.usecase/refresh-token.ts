import {
  deleteCachedRefreshToken,
  getCachedRefreshTokenUserId,
  setCachedRefreshToken,
} from '@/adapter/secondary/cache/refresh-token-cache'
import { createRoleAndPermissionRepo } from '@/adapter/secondary/repository/role_and_permission/role_and_permission.repo'
import { generateRefreshToken, generateToken, verifyRefreshToken } from '@/common/jwt'
import * as Entity from '@/entities/user.entity'
import { createRoleAndPermissionUsecase } from '@/modules/role_and_permission/role_and_permission.usecase'

import { UserUsecaseDeps } from '../user.usecase'

const roleAndPermissionUsecase = createRoleAndPermissionUsecase(createRoleAndPermissionRepo())

export async function refreshUserToken(
  deps: UserUsecaseDeps,
  req: Entity.RefreshTokenReq,
): Promise<Entity.LoginRes | null> {
  const oldToken = req.refresh_token

  let decoded: { id: string }
  try {
    decoded = verifyRefreshToken(oldToken)
  } catch {
    return null
  }

  // ponytail: cache doubles as a revocation/rotation check — a valid JWT
  // signature alone isn't enough, it must also still be the live token.
  const cachedUserId = await getCachedRefreshTokenUserId(oldToken)
  if (!cachedUserId || cachedUserId !== decoded.id) return null

  const user = await deps.repo.findById(decoded.id)
  if (!user || user.status !== 'active') return null

  await deleteCachedRefreshToken(oldToken)

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
    ...user,
  }
}
