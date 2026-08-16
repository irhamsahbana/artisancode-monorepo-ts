import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IQuotationRepo } from '@/contracts/quotation.contract'
import { quotations } from '@/db/schema'
import * as Entity from '@/entities/quotation.entity'

function toEntity(data: typeof quotations.$inferSelect): Entity.QuotationRequest {
  return {
    id: data.id,
    title: data.title,
    projectId: data.projectId,
    topic: data.topic,
    requesterName: data.requesterName,
    companyName: data.companyName,
    whatsapp: data.whatsapp,
    email: data.email,
    products: data.products.map((p) => ({
      productName: p.productName,
      specification: p.specification,
      quantity: p.quantity,
    })),
    notes: data.notes,
    status: data.status,
    createdAt: data.createdAt,
  }
}

export function createQuotationRepo(): IQuotationRepo {
  return {
    create: async (req) => {
      const [row] = await getExecutor()
        .insert(quotations)
        .values({
          title: req.title,
          projectId: req.projectId,
          topic: req.topic,
          requesterName: req.requesterName,
          companyName: req.companyName,
          whatsapp: req.whatsapp,
          email: req.email,
          products: (req.products ?? []).map((p) => ({
            productName: p.productName,
            specification: p.specification,
            quantity: p.quantity,
          })),
          notes: req.notes,
        })
        .returning()
      return toEntity(row)
    },

    findById: async (id) => {
      const [row] = await getExecutor()
        .select()
        .from(quotations)
        .where(eq(quotations.id, id))
        .limit(1)
      return row ? toEntity(row) : null
    },

    findList: async (req) => {
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
        items: items.map(toEntity),
        pagination: { total, page, per_page, last_page: Math.max(1, Math.ceil(total / per_page)) },
      }
    },

    updateStatus: async (id, status) => {
      const [row] = await getExecutor()
        .update(quotations)
        .set({ status, updatedAt: new Date() })
        .where(eq(quotations.id, id))
        .returning()
      return row ? toEntity(row) : null
    },

    assignProject: async (req) => {
      const [row] = await getExecutor()
        .update(quotations)
        .set({ projectId: req.projectId, updatedAt: new Date() })
        .where(eq(quotations.id, req.id))
        .returning()
      return row ? toEntity(row) : null
    },
  }
}
