import { asc, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { unitConversions } from '@/db/schema'
import * as Entity from '@/entities/uom.entity'

import { UomRepoDeps } from '../uom.repo'

export async function findConversionList(
  deps: UomRepoDeps,
  req: Entity.GetUomReq,
): Promise<Entity.UnitConversionList> {
  const { pagination = {} } = req
  const { page = 1, per_page = 100 } = pagination
  const offset = (page - 1) * per_page
  const exec = getExecutor()

  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(unitConversions)
      .where(isNull(unitConversions.deletedAt))
      .orderBy(asc(unitConversions.createdAt))
      .limit(per_page)
      .offset(offset),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(unitConversions)
      .where(isNull(unitConversions.deletedAt)),
  ])

  const total = countResult[0]?.count ?? 0
  return {
    items: items.map(deps.conversionToEntity),
    pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
  }
}
