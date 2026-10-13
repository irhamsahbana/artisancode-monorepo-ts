import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBirthdayGreetingUsecase } from '@/contracts/birthday_greeting.contract'

export function findBirthdayGreetingHandler(usecase: IBirthdayGreetingUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.find()
    return c.json(responseSuccess(data))
  }
}
