import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IWebhookUsecase } from '@/contracts/webhook.contract'

export function createWebhookHandler(usecase: IWebhookUsecase) {
  return {
    // Public: called by DOKU's server, not our frontend — no auth, and the
    // raw body text (not the parsed JSON) is required for signature verification.
    notify: async (c: Context<AppEnv>) => {
      const headers: Record<string, string> = {}
      c.req.raw.headers.forEach((value, key) => {
        headers[key] = value
      })
      const body = await c.req.text()

      const data = await usecase.processPaymentNotification(headers, body, c.req.path)
      return c.json(responseSuccess(data))
    },

    findList: async (c: Context<AppEnv>) => {
      const query = c.get('body')?._query || c.req.query()
      const { page, per_page, invoiceNumber } = query as Record<string, string>
      const data = await usecase.getWebhookLogs({
        invoiceNumber,
        pagination: { page: Number(page) || 1, per_page: Number(per_page) || 10 },
      })
      return c.json(responseSuccess(data))
    },
  }
}
