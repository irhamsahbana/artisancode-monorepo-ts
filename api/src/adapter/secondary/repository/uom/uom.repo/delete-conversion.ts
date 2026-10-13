import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { unitConversions } from '@/db/schema'

export async function deleteConversion(id: string): Promise<void> {
  await getExecutor()
    .update(unitConversions)
    .set({ deletedAt: sql`now()` as unknown as Date })
    .where(and(eq(unitConversions.id, id), isNull(unitConversions.deletedAt)))
}
