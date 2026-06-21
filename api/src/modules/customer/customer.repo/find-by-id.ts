import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { customers } from '@/db/schema'
import * as Entity from '@/entities/customer.entity'

import { CustomerRepoDeps } from '../customer.repo'

export async function findCustomerById(
  deps: CustomerRepoDeps,
  id: string,
  companyId: string,
): Promise<Entity.Customer | null> {
  const [row] = await getExecutor()
    .select()
    .from(customers)
    .where(
      and(eq(customers.id, id), eq(customers.companyId, companyId), isNull(customers.deletedAt)),
    )
    .limit(1)
  return row ? deps.toEntity(row) : null
}
