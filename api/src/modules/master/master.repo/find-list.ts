import { and, eq, ilike, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { masterItems } from '@/db/schema'
import * as Entity from '@/entities/master.entity'

import { MasterRepoDeps } from '../master.repo'

export async function findMasterItemList(
  deps: MasterRepoDeps,
  req: Entity.GetMasterItemReq,
): Promise<Entity.MasterItemList> {
  const { pagination = {}, company_id, type, q, isActive } = req
  const { page = 1, per_page = 10 } = pagination
  const offset = (page - 1) * per_page

  const conditions = [
    eq(masterItems.companyId, company_id),
    eq(masterItems.type, type),
    isNull(masterItems.deletedAt),
  ]

  if (q) {
    conditions.push(ilike(masterItems.name, `%${q}%`))
  }

  if (isActive !== undefined) {
    conditions.push(eq(masterItems.isActive, isActive))
  }

  const where = and(...conditions)
  const exec = getExecutor()

  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(masterItems)
      .where(where)
      .orderBy(sql`${masterItems.createdAt} desc`)
      .limit(per_page)
      .offset(offset),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(masterItems)
      .where(where),
  ])

  const total = countResult[0]?.count ?? 0

  return {
    items: items.map((item) => deps.toEntity(item)),
    pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
  }
}
