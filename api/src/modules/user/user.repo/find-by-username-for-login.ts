import { eq, and, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { users } from '@/db/schema'
import * as Entity from '@/entities/user.entity'

export async function findUserByUsernameForLogin(
  email: string,
): Promise<(Entity.User & { password: string }) | null> {
  const [row] = await getExecutor()
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1)
  return (row as Entity.User & { password: string }) ?? null
}
