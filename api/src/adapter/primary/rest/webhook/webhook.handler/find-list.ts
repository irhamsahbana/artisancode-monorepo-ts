import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IWebhookUsecase } from '@/contracts/webhook.contract'

export function findWebhookListHandler(usecase: IWebhookUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, per_page, invoiceNumber } = query as Record<string, string>
    const data = await usecase.getWebhookLogs({
      invoiceNumber,
      pagination: { page: Number(page) || 1, per_page: Number(per_page) || 10 },
    })
    return c.json(responseSuccess(data))
  }
}
