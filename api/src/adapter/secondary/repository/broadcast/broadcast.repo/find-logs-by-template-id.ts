import { desc, eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { broadcastLogs } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'

import type { BroadcastRepoDeps } from '../broadcast.repo'

export async function findBroadcastLogsByTemplateId(
  deps: BroadcastRepoDeps,
  templateId: string,
): Promise<Entity.BroadcastLog[]> {
  const rows = await getExecutor()
    .select()
    .from(broadcastLogs)
    .where(eq(broadcastLogs.templateId, templateId))
    .orderBy(desc(broadcastLogs.sentAt))
  return rows.map(deps.logToEntity)
}
