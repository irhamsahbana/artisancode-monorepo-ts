import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { masterItems } from '@/db/schema'

export async function deleteMasterItem(id: string, companyId: string): Promise<void> {
  await getExecutor()
    .update(masterItems)
    .set({ deletedAt: sql`now()` as unknown as Date })
    .where(
      and(
        eq(masterItems.id, id),
        eq(masterItems.companyId, companyId),
        isNull(masterItems.deletedAt),
      ),
    )
}
