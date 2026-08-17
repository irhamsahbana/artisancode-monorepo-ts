import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'
import jwt from 'jsonwebtoken'

import { deleteCachedRefreshToken } from '@/adapter/secondary/cache/refresh-token-cache'
import { blockToken } from '@/adapter/secondary/cache/token-blocklist-cache'
import { responseSuccess } from '@/common/rest_response'

export function logoutHandler() {
  return async (c: Context<AppEnv>) => {
    const token = c.req.header('authorization')?.split(' ')[1] ?? ''
    const decoded = jwt.decode(token) as jwt.JwtPayload | null
    if (decoded?.exp) blockToken(token, decoded.exp)

    const body = await c.req.json().catch(() => null)
    if (body?.refresh_token) await deleteCachedRefreshToken(body.refresh_token)

    return c.json(responseSuccess(null, 'Logout successful'))
  }
}
