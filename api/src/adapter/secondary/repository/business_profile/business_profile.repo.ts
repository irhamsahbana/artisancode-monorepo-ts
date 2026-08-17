import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IBusinessProfileRepo } from '@/contracts/business_profile.contract'
import { businessProfiles } from '@/db/schema'
import * as Entity from '@/entities/business_profile.entity'

function toEntity(data: typeof businessProfiles.$inferSelect): Entity.BusinessProfile {
  return {
    id: data.id,
    name: data.name,
    businessType: data.businessType,
    phone: data.phone,
    countryCode: data.countryCode,
    email: data.email,
    address: data.address,
  }
}

export function createBusinessProfileRepo(): IBusinessProfileRepo {
  return {
    find: async () => {
      const [row] = await getExecutor()
        .select()
        .from(businessProfiles)
        .where(isNull(businessProfiles.deletedAt))
        .limit(1)
      return row ? toEntity(row) : null
    },

    update: async (req) => {
      const updates: Partial<typeof businessProfiles.$inferInsert> = {
        updatedAt: sql`now()` as unknown as Date,
      }

      if (req.name !== undefined) updates.name = req.name
      if (req.businessType !== undefined) updates.businessType = req.businessType
      if (req.phone !== undefined) updates.phone = req.phone
      if (req.countryCode !== undefined) updates.countryCode = req.countryCode
      if (req.email !== undefined) updates.email = req.email
      if (req.address !== undefined) updates.address = req.address

      // Upsert against the single row
      const [existing] = await getExecutor()
        .select({ id: businessProfiles.id })
        .from(businessProfiles)
        .where(isNull(businessProfiles.deletedAt))
        .limit(1)

      const [row] = existing
        ? await getExecutor()
            .update(businessProfiles)
            .set(updates)
            .where(and(eq(businessProfiles.id, existing.id), isNull(businessProfiles.deletedAt)))
            .returning()
        : await getExecutor()
            .insert(businessProfiles)
            .values({ name: req.name ?? '', ...updates })
            .returning()

      return row ? toEntity(row) : null
    },
  }
}
