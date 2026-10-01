import { setCachedRefreshToken } from '@/adapter/secondary/cache/refresh-token-cache'
import { createRoleAndPermissionRepo } from '@/adapter/secondary/repository/role_and_permission/role_and_permission.repo'
import { generateRefreshToken, generateToken } from '@/common/jwt'
import * as Entity from '@/entities/user.entity'
import { createRoleAndPermissionUsecase } from '@/modules/role_and_permission/role_and_permission.usecase'

const roleAndPermissionUsecase = createRoleAndPermissionUsecase(createRoleAndPermissionRepo())

export async function issueSession(user: Entity.User): Promise<Entity.LoginRes> {
  const token = generateToken({
    id: user.id,
    role_id: user.roleId,
    name: user.name,
    username: user.username,
  })
  const refreshToken = generateRefreshToken({ id: user.id })
  await setCachedRefreshToken(refreshToken, user.id)

  const permissions = await roleAndPermissionUsecase.getPermissionNamesByRoleId(user.roleId)

  return { token, refreshToken, permissions, ...user }
}
