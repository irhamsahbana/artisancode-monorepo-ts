import type {
  GetWebhookLogListReq,
  WebhookLogList,
} from '@/contracts/webhook.contract'

import type { WebhookUsecaseDeps } from '../webhook.usecase'

export async function getWebhookLogs(
  deps: WebhookUsecaseDeps,
  req: GetWebhookLogListReq,
): Promise<WebhookLogList> {
  return deps.repo.getWebhookLogs(req)
}
