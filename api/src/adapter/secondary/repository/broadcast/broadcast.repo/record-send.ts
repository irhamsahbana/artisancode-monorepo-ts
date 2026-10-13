import { eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { broadcastLogs, broadcastTemplates } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'

import type { BroadcastRepoDeps } from '../broadcast.repo'

export async function recordBroadcastSend(
  deps: BroadcastRepoDeps,
  templateId: string,
  recipientLogs: Entity.PerContactLog[],
): Promise<Entity.BroadcastLog> {
  const exec = getExecutor()

  const sentCount = recipientLogs.filter((l) => l.status === 'sent').length
  const failedCount = recipientLogs.filter((l) => l.status === 'failed').length

  let overallStatus: 'pending' | 'sent' | 'failed' = 'pending'
  if (sentCount > 0) overallStatus = 'sent'
  else if (failedCount > 0) overallStatus = 'failed'

  const [logRow] = await exec
    .insert(broadcastLogs)
    .values({
      templateId,
      recipientCount: String(recipientLogs.length),
      status: overallStatus,
      recipientLogs,
    })
    .returning()

  await exec
    .update(broadcastTemplates)
    .set({ status: 'sent', sentAt: new Date() })
    .where(eq(broadcastTemplates.id, templateId))

  return deps.logToEntity(logRow)
}
