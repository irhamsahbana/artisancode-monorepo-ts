import { eq, and, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { categories } from '@/db/schema'

export async function deleteCategory(id: string): Promise<void> {
  await getExecutor()
    .update(categories)
    .set({ deletedAt: new Date() })
    .where(and(eq(categories.id, id), isNull(categories.deletedAt)))
}
