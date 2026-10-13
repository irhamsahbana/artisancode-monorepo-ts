import { and, asc, eq, ilike, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { products } from '@/db/schema'
import * as Entity from '@/entities/product.entity'

import { ProductRepoDeps } from '../product.repo'

export async function findProductList(
  deps: ProductRepoDeps,
  req: Entity.GetProductReq,
): Promise<Entity.ProductList> {
  const { pagination = {}, q, isActive } = req
  const { page = 1, per_page = 100 } = pagination
  const offset = (page - 1) * per_page

  const conditions = [isNull(products.deletedAt)]
  if (q) conditions.push(ilike(products.name, `%${q}%`))
  if (isActive !== undefined) conditions.push(eq(products.status, isActive ? 'active' : 'inactive'))
  const where = and(...conditions)

  const exec = getExecutor()
  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(products)
      .where(where)
      .orderBy(asc(products.name))
      .limit(per_page)
      .offset(offset),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(where),
  ])

  const total = countResult[0]?.count ?? 0
  return {
    items: items.map(deps.toEntity),
    pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
  }
}
