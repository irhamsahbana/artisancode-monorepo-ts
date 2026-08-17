import { AppEnv, ErrorCode } from '@artisancode/types'
import { Context, Next } from 'hono'

import { responseError } from '@/common/rest_response'

import type { Permission } from '@artisancode/api-types'

export const requirePermission = (permission: Permission) => {
  return async (c: Context<AppEnv>, next: Next) => {
    const user = c.get('user')

    if (!user?.permissions?.includes(permission)) {
      return c.json(
        responseError(`Missing required permission: ${permission}`, undefined, ErrorCode.FORBIDDEN),
        403,
      )
    }

    await next()
  }
}
