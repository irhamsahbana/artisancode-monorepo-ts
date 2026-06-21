import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { IUserUsecase } from '@/contracts/user.contract'

export function getMeHandler(usecase: IUserUsecase) {
  return async (c: Context<AppEnv>) => {
    const user = getUserContext()
    const data = await usecase.findById(user?.id || '', user?.company_id || '')
    return c.json(responseSuccess(data))
  }
}
