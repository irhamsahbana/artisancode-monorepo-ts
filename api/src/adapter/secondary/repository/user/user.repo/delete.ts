import { eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { users } from '@/db/schema'

export async function deleteUser(id: string): Promise<void> {
  await getExecutor().update(users).set({ deletedAt: new Date() }).where(eq(users.id, id))
}
