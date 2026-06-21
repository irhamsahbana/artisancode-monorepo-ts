import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IBusinessProfileRepo } from '@/contracts/business_profile.contract'
import { companies } from '@/db/schema'
import * as Entity from '@/entities/business_profile.entity'

function toEntity(data: typeof companies.$inferSelect): Entity.BusinessProfile {
  return {
    id: data.id,
    name: data.name,
    businessType: data.businessType ?? null,
    phone: data.phone ?? null,
    email: data.email ?? null,
    address: data.address ?? null,
  }
}

export function createBusinessProfileRepo(): IBusinessProfileRepo {
  return {
    findByCompanyId: async (companyId) => {
      const [row] = await getExecutor()
        .select()
        .from(companies)
        .where(and(eq(companies.id, companyId), isNull(companies.deletedAt)))
        .limit(1)
      return row ? toEntity(row) : null
    },

    update: async (req) => {
      const updates: Partial<typeof companies.$inferInsert> = {
        updatedAt: sql`now()` as unknown as Date,
      }

      if (req.name !== undefined) updates.name = req.name
      if (req.businessType !== undefined) updates.businessType = req.businessType
      if (req.phone !== undefined) updates.phone = req.phone
      if (req.email !== undefined) updates.email = req.email
      if (req.address !== undefined) updates.address = req.address

      const [row] = await getExecutor()
        .update(companies)
        .set(updates)
        .where(and(eq(companies.id, req.company_id), isNull(companies.deletedAt)))
        .returning()

      return row ? toEntity(row) : null
    },
  }
}
