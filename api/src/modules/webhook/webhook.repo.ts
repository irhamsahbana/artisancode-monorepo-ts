import type {
  GetWebhookLogListReq,
  IWebhookRepo,
  WebhookLog,
  WebhookLogList,
} from '@/contracts/webhook.contract'

import { getWebhookLogs } from './webhook.repo/get-webhook-logs'
import { logWebhook } from './webhook.repo/log-webhook'

export function createWebhookRepo(): IWebhookRepo {
  return {
    logWebhook: (params) => logWebhook(params),
    getWebhookLogs: (req) => getWebhookLogs(req),
  }
}

export class WebhookRepo implements IWebhookRepo {
  async logWebhook(params: Omit<WebhookLog, 'id' | 'createdAt'>): Promise<WebhookLog> {
    return logWebhook(params)
  }

  async getWebhookLogs(req: GetWebhookLogListReq): Promise<WebhookLogList> {
    return getWebhookLogs(req)
  }
}

export default createWebhookRepo
