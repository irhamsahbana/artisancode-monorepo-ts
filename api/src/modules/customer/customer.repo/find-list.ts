import { and, eq, ilike, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { customers } from '@/db/schema'
import * as Entity from '@/entities/customer.entity'

import { CustomerRepoDeps } from '../customer.repo'

export async function findCustomerList(
  deps: CustomerRepoDeps,
  req: Entity.GetCustomerReq,
): Promise<Entity.CustomerList> {
  const {
    pagination = {},
    company_id,
    q,
    type,
    status,
    potential,
    categoryId,
    areaId,
    hasContractHistory,
  } = req
  const { page = 1, per_page = 10 } = pagination
  const offset = (page - 1) * per_page

  const conditions = [eq(customers.companyId, company_id), isNull(customers.deletedAt)]

  if (q) conditions.push(ilike(customers.name, `%${q}%`))
  if (type) conditions.push(eq(customers.type, type))
  if (status) conditions.push(eq(customers.status, status))
  if (potential) conditions.push(eq(customers.potential, potential))
  if (categoryId) conditions.push(eq(customers.categoryId, categoryId))
  if (areaId) conditions.push(eq(customers.areaId, areaId))
  if (hasContractHistory !== undefined)
    conditions.push(eq(customers.hasContractHistory, hasContractHistory))

  const where = and(...conditions)
  const exec = getExecutor()

  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(customers)
      .where(where)
      .orderBy(sql`${customers.createdAt} desc`)
      .limit(per_page)
      .offset(offset),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(customers)
      .where(where),
  ])

  const total = countResult[0]?.count ?? 0

  return {
    items: items.map((item) => deps.toEntity(item)),
    pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
  }
}
