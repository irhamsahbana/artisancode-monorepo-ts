import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IUserUsecase } from '@/contracts/user.contract'
import * as Entity from '@/entities/user.entity'

export function updateUserHandler(usecase: IUserUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const body = c.get('body')

    const payload = { ...body, id } as Entity.UpdateUserReq

    const data = await usecase.update(payload)
    return c.json(responseSuccess(data, 'User updated successfully'))
  }
}
