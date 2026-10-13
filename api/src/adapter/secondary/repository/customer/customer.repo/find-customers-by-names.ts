import { and, inArray, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { customers } from '@/db/schema'
import * as Entity from '@/entities/customer.entity'

import { CustomerRepoDeps } from '../customer.repo'

export async function findCustomersByNames(
  deps: CustomerRepoDeps,
  names: string[],
): Promise<Entity.Customer[]> {
  if (names.length === 0) return []

  const cleanNames = names.map((n) => n.trim().toLowerCase()).filter(Boolean)
  if (cleanNames.length === 0) return []

  const rows = await getExecutor()
    .select()
    .from(customers)
    .where(
      and(isNull(customers.deletedAt), inArray(sql`lower(trim(${customers.name}))`, cleanNames)),
    )

  return rows.map(deps.toEntity)
}
