import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBroadcastUsecase } from '@/contracts/broadcast.contract'

export function findBroadcastTemplateListHandler(usecase: IBroadcastUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, per_page } = query as Record<string, string>
    const data = await usecase.findTemplateList(Number(page) || 1, Number(per_page) || 10)
    return c.json(responseSuccess(data))
  }
}
