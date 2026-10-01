import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { users } from '@/db/schema'
import * as Entity from '@/entities/user.entity'

import { UserRepoDeps } from '../user.repo'

// Matches against the concatenated country_code + phone, since callers pass
// the full digit string (e.g. "6281234567890") the way toFullPhone builds it.
export async function findUserByPhone(
  deps: UserRepoDeps,
  fullPhone: string,
): Promise<Entity.User | null> {
  const [row] = await getExecutor()
    .select()
    .from(users)
    .where(
      and(
        sql`${users.countryCode} || ${users.phone} = ${fullPhone}`,
        eq(users.status, 'active'),
        isNull(users.deletedAt),
      ),
    )
    .limit(1)
  return row ? deps.toEntity(row) : null
}
