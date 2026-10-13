import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { products } from '@/db/schema'

export async function deleteProduct(id: string): Promise<void> {
  await getExecutor()
    .update(products)
    .set({ deletedAt: sql`now()` as unknown as Date })
    .where(and(eq(products.id, id), isNull(products.deletedAt)))
}
