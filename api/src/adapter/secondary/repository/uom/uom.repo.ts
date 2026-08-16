import { and, asc, eq, ilike, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IUomRepo } from '@/contracts/uom.contract'
import { uoms, unitConversions } from '@/db/schema'
import * as Entity from '@/entities/uom.entity'

function uomToEntity(data: typeof uoms.$inferSelect): Entity.UnitOfMeasurement {
  return {
    id: data.id,
    name: data.name,
    symbol: data.symbol,
    category: data.category,
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

function conversionToEntity(data: typeof unitConversions.$inferSelect): Entity.UnitConversion {
  return {
    id: data.id,
    fromUnitId: data.fromUnitId,
    toUnitId: data.toUnitId,
    factor: Number(data.factor),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export function createUomRepo(): IUomRepo {
  return {
    createUom: async (req) => {
      const [row] = await getExecutor()
        .insert(uoms)
        .values({ name: req.name, symbol: req.symbol, category: req.category })
        .returning()
      return uomToEntity(row)
    },

    findUomList: async (req) => {
      const { pagination = {}, q, category, isActive } = req
      const { page = 1, per_page = 100 } = pagination
      const offset = (page - 1) * per_page

      const conditions = []
      if (q) conditions.push(ilike(uoms.name, `%${q}%`))
      if (category) conditions.push(eq(uoms.category, category))
      if (isActive !== undefined) conditions.push(eq(uoms.isActive, isActive))
      const where = conditions.length ? and(...conditions) : undefined

      const exec = getExecutor()
      const [items, countResult] = await Promise.all([
        exec
          .select()
          .from(uoms)
          .where(where)
          .orderBy(asc(uoms.name))
          .limit(per_page)
          .offset(offset),
        exec
          .select({ count: sql<number>`count(*)::int` })
          .from(uoms)
          .where(where),
      ])

      const total = countResult[0]?.count ?? 0
      return {
        items: items.map(uomToEntity),
        pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
      }
    },

    updateUom: async (req) => {
      const updates: Partial<typeof uoms.$inferInsert> = { updatedAt: new Date() }
      if (req.name !== undefined) updates.name = req.name
      if (req.symbol !== undefined) updates.symbol = req.symbol
      if (req.category !== undefined) updates.category = req.category
      if (req.isActive !== undefined) updates.isActive = req.isActive

      const [row] = await getExecutor()
        .update(uoms)
        .set(updates)
        .where(eq(uoms.id, req.id))
        .returning()
      return row ? uomToEntity(row) : null
    },

    createConversion: async (req) => {
      const [row] = await getExecutor()
        .insert(unitConversions)
        .values({
          fromUnitId: req.fromUnitId,
          toUnitId: req.toUnitId,
          factor: String(req.factor),
        })
        .returning()
      return conversionToEntity(row)
    },

    findConversionList: async (req) => {
      const { pagination = {} } = req
      const { page = 1, per_page = 100 } = pagination
      const offset = (page - 1) * per_page
      const exec = getExecutor()

      const [items, countResult] = await Promise.all([
        exec
          .select()
          .from(unitConversions)
          .orderBy(asc(unitConversions.createdAt))
          .limit(per_page)
          .offset(offset),
        exec.select({ count: sql<number>`count(*)::int` }).from(unitConversions),
      ])

      const total = countResult[0]?.count ?? 0
      return {
        items: items.map(conversionToEntity),
        pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
      }
    },

    updateConversion: async (req) => {
      const updates: Partial<typeof unitConversions.$inferInsert> = { updatedAt: new Date() }
      if (req.fromUnitId !== undefined) updates.fromUnitId = req.fromUnitId
      if (req.toUnitId !== undefined) updates.toUnitId = req.toUnitId
      if (req.factor !== undefined) updates.factor = String(req.factor)

      const [row] = await getExecutor()
        .update(unitConversions)
        .set(updates)
        .where(eq(unitConversions.id, req.id))
        .returning()
      return row ? conversionToEntity(row) : null
    },
  }
}
