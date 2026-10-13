import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { quotations } from '@/db/schema'
import * as Entity from '@/entities/quotation.entity'

import { QuotationRepoDeps } from '../quotation.repo'

export async function findQuotationList(
  deps: QuotationRepoDeps,
  req: Entity.GetQuotationListReq,
): Promise<Entity.QuotationList> {
  const { pagination = {}, q, status } = req
  const { page = 1, per_page = 10 } = pagination

  const conditions = []
  if (q) {
    const search = or(
      ilike(quotations.requesterName, `%${q}%`),
      ilike(quotations.companyName, `%${q}%`),
      ilike(quotations.title, `%${q}%`),
    )
    if (search) conditions.push(search)
  }
  if (status) conditions.push(eq(quotations.status, status))
  const where = conditions.length ? and(...conditions) : undefined

  const exec = getExecutor()
  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(quotations)
      .where(where)
      .orderBy(desc(quotations.createdAt))
      .limit(per_page)
      .offset((page - 1) * per_page),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(quotations)
      .where(where),
  ])

  const total = countResult[0]?.count ?? 0
  return {
    items: items.map(deps.toEntity),
    pagination: { total, page, per_page, last_page: Math.max(1, Math.ceil(total / per_page)) },
  }
}
