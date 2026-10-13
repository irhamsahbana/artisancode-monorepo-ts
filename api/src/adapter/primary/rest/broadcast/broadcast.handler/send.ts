import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBroadcastUsecase } from '@/contracts/broadcast.contract'

export function sendBroadcastHandler(usecase: IBroadcastUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.send({ templateId: c.get('body').templateId })
    return c.json(responseSuccess(data, 'Broadcast sent successfully'))
  }
}
