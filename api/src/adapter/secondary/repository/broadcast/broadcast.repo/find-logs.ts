import { desc } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { broadcastLogs } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'

import type { BroadcastRepoDeps } from '../broadcast.repo'

export async function findBroadcastLogs(deps: BroadcastRepoDeps): Promise<Entity.BroadcastLog[]> {
  const rows = await getExecutor().select().from(broadcastLogs).orderBy(desc(broadcastLogs.sentAt))
  return rows.map(deps.logToEntity)
}
