import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBroadcastUsecase } from '@/contracts/broadcast.contract'

export function findBroadcastLogsHandler(usecase: IBroadcastUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.findLogs()
    return c.json(responseSuccess(data))
  }
}
