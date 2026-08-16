import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { contacts } from '@/db/schema'

export async function deleteContact(id: string): Promise<void> {
  await getExecutor()
    .update(contacts)
    .set({ deletedAt: sql`now()` as unknown as Date })
    .where(and(eq(contacts.id, id), isNull(contacts.deletedAt)))
}
