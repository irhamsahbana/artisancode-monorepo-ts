import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBusinessProfileUsecase } from '@/contracts/business_profile.contract'

export function findBusinessProfileHandler(usecase: IBusinessProfileUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.find()
    return c.json(responseSuccess(data))
  }
}
