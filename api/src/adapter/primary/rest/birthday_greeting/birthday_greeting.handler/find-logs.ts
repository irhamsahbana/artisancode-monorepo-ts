import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBirthdayGreetingUsecase } from '@/contracts/birthday_greeting.contract'

export function findBirthdayGreetingLogsHandler(usecase: IBirthdayGreetingUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.findLogs()
    return c.json(responseSuccess(data))
  }
}
