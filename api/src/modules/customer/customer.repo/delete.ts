import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { customers } from '@/db/schema'

export async function deleteCustomer(id: string, companyId: string): Promise<void> {
  await getExecutor()
    .update(customers)
    .set({ deletedAt: sql`now()` as unknown as Date })
    .where(
      and(eq(customers.id, id), eq(customers.companyId, companyId), isNull(customers.deletedAt)),
    )
}
