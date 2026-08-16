import { AppEnv, ErrorCode } from '@artisancode/types'
import { Context } from 'hono'

import { responseError, responseSuccess } from '@/common/rest_response'
import { IUserUsecase } from '@/contracts/user.contract'

export function findUserByIdHandler(usecase: IUserUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''

    const data = await usecase.findById(id)
    if (!data) {
      return c.json(responseError('User not found', undefined, ErrorCode.NOT_FOUND), 404)
    }
    return c.json(responseSuccess(data))
  }
}
