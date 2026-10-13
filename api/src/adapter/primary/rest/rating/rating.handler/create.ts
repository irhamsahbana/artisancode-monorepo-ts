import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IRatingUsecase } from '@/contracts/rating.contract'

export function createRatingHandler(usecase: IRatingUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.create(c.get('body'))
    return c.json(responseSuccess(data, 'Customer rating created successfully'), 201)
  }
}
