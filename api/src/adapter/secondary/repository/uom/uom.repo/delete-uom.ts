import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { uoms } from '@/db/schema'

export async function deleteUom(id: string): Promise<void> {
  await getExecutor()
    .update(uoms)
    .set({ deletedAt: sql`now()` as unknown as Date })
    .where(and(eq(uoms.id, id), isNull(uoms.deletedAt)))
}
