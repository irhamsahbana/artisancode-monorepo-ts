import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBroadcastUsecase } from '@/contracts/broadcast.contract'

export function deleteBroadcastTemplateHandler(usecase: IBroadcastUsecase) {
  return async (c: Context<AppEnv>) => {
    await usecase.deleteTemplate(c.req.param('id') as string)
    return c.json(responseSuccess(null, 'Broadcast template deleted successfully'))
  }
}
