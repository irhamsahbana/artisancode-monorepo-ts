import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IWebhookUsecase } from '@/contracts/webhook.contract'

export function notifyWebhookHandler(usecase: IWebhookUsecase) {
  return async (c: Context<AppEnv>) => {
    const headers: Record<string, string> = {}
    c.req.raw.headers.forEach((value, key) => {
      headers[key] = value
    })
    const body = await c.req.text()

    const data = await usecase.processPaymentNotification(headers, body, c.req.path)
    return c.json(responseSuccess(data))
  }
}
