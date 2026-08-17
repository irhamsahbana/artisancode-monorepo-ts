import { AppEnv, ErrorCode } from '@artisancode/types'
import { Context } from 'hono'

import { responseError, responseSuccess } from '@/common/rest_response'
import { IUserUsecase } from '@/contracts/user.contract'
import * as Entity from '@/entities/user.entity'

export function refreshTokenHandler(usecase: IUserUsecase) {
  return async (c: Context<AppEnv>) => {
    const body = c.get('body')
    const payload = body as Entity.RefreshTokenReq
    const data = await usecase.refreshToken(payload)
    if (!data) {
      return c.json(
        responseError('Invalid or expired refresh token', undefined, ErrorCode.AUTH_TOKEN_INVALID),
        401,
      )
    }
    return c.json(responseSuccess(data, 'Token refreshed'))
  }
}
