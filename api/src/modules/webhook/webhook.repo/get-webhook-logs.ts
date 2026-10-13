import { desc, eq, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import type {
  GetWebhookLogListReq,
  WebhookLog,
  WebhookLogList,
} from '@/contracts/webhook.contract'
import { webhookLogs } from '@/db/schema'

export async function getWebhookLogs(req: GetWebhookLogListReq): Promise<WebhookLogList> {
  const { invoiceNumber, pagination = {} } = req
  const { page = 1, per_page = 10 } = pagination

  const where = invoiceNumber ? eq(webhookLogs.invoiceNumber, invoiceNumber) : undefined
  const exec = getExecutor()

  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(webhookLogs)
      .where(where)
      .orderBy(desc(webhookLogs.createdAt))
      .limit(per_page)
      .offset((page - 1) * per_page),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(webhookLogs)
      .where(where),
  ])

  const total = countResult[0]?.count ?? 0

  return {
    items: items as WebhookLog[],
    pagination: { total, page, per_page, last_page: Math.max(1, Math.ceil(total / per_page)) },
  }
}
