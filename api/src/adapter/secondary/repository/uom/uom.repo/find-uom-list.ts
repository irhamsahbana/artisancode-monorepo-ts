import { and, asc, eq, ilike, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { uoms } from '@/db/schema'
import * as Entity from '@/entities/uom.entity'

import { UomRepoDeps } from '../uom.repo'

export async function findUomList(
  deps: UomRepoDeps,
  req: Entity.GetUomReq,
): Promise<Entity.UomList> {
  const { pagination = {}, q, category, isActive } = req
  const { page = 1, per_page = 100 } = pagination
  const offset = (page - 1) * per_page

  const conditions = [isNull(uoms.deletedAt)]
  if (q) conditions.push(ilike(uoms.name, `%${q}%`))
  if (category) conditions.push(eq(uoms.category, category))
  if (isActive !== undefined) conditions.push(eq(uoms.isActive, isActive))
  const where = and(...conditions)

  const exec = getExecutor()
  const [items, countResult] = await Promise.all([
    exec.select().from(uoms).where(where).orderBy(asc(uoms.name)).limit(per_page).offset(offset),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(uoms)
      .where(where),
  ])

  const total = countResult[0]?.count ?? 0
  return {
    items: items.map(deps.uomToEntity),
    pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
  }
}
