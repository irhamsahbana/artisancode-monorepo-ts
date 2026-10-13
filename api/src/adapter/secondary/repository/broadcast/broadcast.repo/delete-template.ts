import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { broadcastTemplates } from '@/db/schema'

export async function deleteBroadcastTemplate(id: string): Promise<void> {
  await getExecutor()
    .update(broadcastTemplates)
    .set({ deletedAt: sql`now()` as unknown as Date })
    .where(and(eq(broadcastTemplates.id, id), isNull(broadcastTemplates.deletedAt)))
}
