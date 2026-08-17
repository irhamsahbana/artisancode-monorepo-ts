import { and, asc, eq, ilike, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IProductRepo } from '@/contracts/product.contract'
import { products } from '@/db/schema'
import * as Entity from '@/entities/product.entity'

function toEntity(data: typeof products.$inferSelect): Entity.Product {
  return {
    id: data.id,
    name: data.name,
    unit: data.unit,
    isActive: data.status === 'active',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export function createProductRepo(): IProductRepo {
  return {
    create: async (req) => {
      const [row] = await getExecutor()
        .insert(products)
        .values({ name: req.name, unit: req.unit })
        .returning()
      return toEntity(row)
    },

    findList: async (req) => {
      const { pagination = {}, q, isActive } = req
      const { page = 1, per_page = 100 } = pagination
      const offset = (page - 1) * per_page

      const conditions = [isNull(products.deletedAt)]
      if (q) conditions.push(ilike(products.name, `%${q}%`))
      if (isActive !== undefined)
        conditions.push(eq(products.status, isActive ? 'active' : 'inactive'))
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
        items: items.map(toEntity),
        pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
      }
    },

    update: async (req) => {
      const updates: Partial<typeof products.$inferInsert> = { updatedAt: new Date() }
      if (req.name !== undefined) updates.name = req.name
      if (req.unit !== undefined) updates.unit = req.unit
      if (req.isActive !== undefined) updates.status = req.isActive ? 'active' : 'inactive'

      const [row] = await getExecutor()
        .update(products)
        .set(updates)
        .where(and(eq(products.id, req.id), isNull(products.deletedAt)))
        .returning()
      return row ? toEntity(row) : null
    },

    delete: async (id) => {
      await getExecutor()
        .update(products)
        .set({ deletedAt: sql`now()` as unknown as Date })
        .where(and(eq(products.id, id), isNull(products.deletedAt)))
    },
  }
}
