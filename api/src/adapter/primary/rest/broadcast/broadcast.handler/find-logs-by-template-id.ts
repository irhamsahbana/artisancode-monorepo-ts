import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBroadcastUsecase } from '@/contracts/broadcast.contract'

export function findBroadcastLogsByTemplateIdHandler(usecase: IBroadcastUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.findLogsByTemplateId(c.req.param('id') as string)
    return c.json(responseSuccess(data))
  }
}
