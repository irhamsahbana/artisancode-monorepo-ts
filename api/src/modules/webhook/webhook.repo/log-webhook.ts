import { getExecutor } from '@/common/executor'
import type { WebhookLog } from '@/contracts/webhook.contract'
import { webhookLogs } from '@/db/schema'

export async function logWebhook(
  params: Omit<WebhookLog, 'id' | 'createdAt'>,
): Promise<WebhookLog> {
  const exec = getExecutor()
  const [webhookLog] = await exec.insert(webhookLogs).values(params).returning()
  return webhookLog as WebhookLog
}
