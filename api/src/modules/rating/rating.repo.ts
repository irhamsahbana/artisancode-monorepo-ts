import { and, eq, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IRatingRepo } from '@/contracts/rating.contract'
import { customerRatings } from '@/db/schema'
import * as Entity from '@/entities/rating.entity'

function toEntity(data: typeof customerRatings.$inferSelect): Entity.CustomerRating {
  return {
    id: data.id,
    customerId: data.customerId,
    contactId: data.contactId,
    ratingDate: data.ratingDate,
    paymentScore: Number(data.paymentScore),
    relationshipScore: Number(data.relationshipScore),
    problemNotes: data.problemNotes,
    riskLevel: data.riskLevel,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export function createRatingRepo(): IRatingRepo {
  return {
    create: async (req) => {
      const [row] = await getExecutor()
        .insert(customerRatings)
        .values({
          customerId: req.customerId,
          contactId: req.contactId,
          ratingDate: req.ratingDate,
          paymentScore: String(req.paymentScore),
          relationshipScore: String(req.relationshipScore),
          problemNotes: req.problemNotes,
          riskLevel: req.riskLevel,
          notes: req.notes,
        })
        .returning()
      return toEntity(row)
    },

    findList: async (req) => {
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
        items: items.map(toEntity),
        pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
      }
    },
  }
}
