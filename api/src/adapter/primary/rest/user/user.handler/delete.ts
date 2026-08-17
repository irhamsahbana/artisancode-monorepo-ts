import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { IUserUsecase } from '@/contracts/user.contract'

export function deleteUserHandler(usecase: IUserUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const requestedById = getUserContext()?.id || ''

    await usecase.delete(id, requestedById)
    return c.json(responseSuccess(null, 'User deleted successfully'))
  }
}
