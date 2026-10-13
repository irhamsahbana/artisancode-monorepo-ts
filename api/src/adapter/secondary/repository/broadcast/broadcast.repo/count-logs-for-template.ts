import { eq, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { broadcastLogs } from '@/db/schema'

export async function countLogsForTemplate(templateId: string): Promise<number> {
  const [result] = await getExecutor()
    .select({ count: sql<number>`count(*)::int` })
    .from(broadcastLogs)
    .where(eq(broadcastLogs.templateId, templateId))
  return result?.count ?? 0
}
