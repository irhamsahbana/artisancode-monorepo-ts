import { AppEnv, ErrorCode, JwtPayload } from '@artisancode/types'
import { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'

import { isTokenBlocked } from '@/adapter/secondary/cache/token-blocklist-cache'
import { createRoleAndPermissionRepo } from '@/adapter/secondary/repository/role_and_permission/role_and_permission.repo'
import { verifyToken } from '@/common/jwt'
import { responseError } from '@/common/rest_response'
import { runWithUserContext } from '@/common/store/user-context'
import logger from '@/config/logger'
import { createRoleAndPermissionUsecase } from '@/modules/role_and_permission/role_and_permission.usecase'

const roleAndPermissionUsecase = createRoleAndPermissionUsecase(createRoleAndPermissionRepo())

export const authenticate = async (c: Context<AppEnv>, next: Next) => {
  const authHeader = c.req.header('authorization')

  if (!authHeader) {
    return c.json(
      responseError('Authorization header missing', undefined, ErrorCode.UNAUTHORIZED),
      401,
    )
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return c.json(responseError('Token missing', undefined, ErrorCode.UNAUTHORIZED), 401)
  }

  if (await isTokenBlocked(token)) {
    return c.json(responseError('Token invalid', undefined, ErrorCode.AUTH_TOKEN_INVALID), 401)
  }

  try {
    const decoded = verifyToken(token) as JwtPayload
    decoded.permissions = await roleAndPermissionUsecase.getPermissionNamesByRoleId(decoded.role_id)
    c.set('user', decoded)
    return runWithUserContext(decoded, () => next())
  } catch (error) {
    logger.error('Error authenticating token:', error)
    if (error instanceof jwt.TokenExpiredError) {
      return c.json(responseError('Token expired', undefined, ErrorCode.AUTH_TOKEN_EXPIRED), 401)
    }
    return c.json(responseError('Invalid token', undefined, ErrorCode.AUTH_TOKEN_INVALID), 401)
  }
}
