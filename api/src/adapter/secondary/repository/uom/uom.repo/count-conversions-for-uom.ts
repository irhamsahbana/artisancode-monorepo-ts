import { and, eq, isNull, or, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { unitConversions } from '@/db/schema'

export async function countConversionsForUom(uomId: string): Promise<number> {
  const [result] = await getExecutor()
    .select({ count: sql<number>`count(*)::int` })
    .from(unitConversions)
    .where(
      and(
        or(eq(unitConversions.fromUnitId, uomId), eq(unitConversions.toUnitId, uomId)),
        isNull(unitConversions.deletedAt),
      ),
    )
  return result?.count ?? 0
}
