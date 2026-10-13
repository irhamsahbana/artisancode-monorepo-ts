import { and, eq, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { customerRatings } from '@/db/schema'
import * as Entity from '@/entities/rating.entity'

import { RatingRepoDeps } from '../rating.repo'

export async function findRatingList(
  deps: RatingRepoDeps,
  req: Entity.GetCustomerRatingReq,
): Promise<Entity.CustomerRatingList> {
  const { page = 1, per_page = 10, customerId, contactId } = req
  const offset = (page - 1) * per_page

  const conditions = []
  if (customerId) conditions.push(eq(customerRatings.customerId, customerId))
  if (contactId) conditions.push(eq(customerRatings.contactId, contactId))
  const where = conditions.length ? and(...conditions) : undefined

  const exec = getExecutor()
  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(customerRatings)
      .where(where)
      .orderBy(sql`${customerRatings.ratingDate} desc`)
      .limit(per_page)
      .offset(offset),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(customerRatings)
      .where(where),
  ])

  const total = countResult[0]?.count ?? 0
  return {
    items: items.map(deps.toEntity),
    pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
  }
}
