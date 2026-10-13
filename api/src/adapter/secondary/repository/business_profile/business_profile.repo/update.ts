import { localPhoneDigits } from '@artisancode/phone'
import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { businessProfiles } from '@/db/schema'
import * as Entity from '@/entities/business_profile.entity'

import type { BusinessProfileRepoDeps } from '../business_profile.repo'

export async function updateBusinessProfile(
  deps: BusinessProfileRepoDeps,
  req: Entity.UpdateBusinessProfileReq,
): Promise<Entity.BusinessProfile | null> {
  const updates: Partial<typeof businessProfiles.$inferInsert> = {
    updatedAt: sql`now()` as unknown as Date,
  }

  if (req.name !== undefined) updates.name = req.name
  if (req.businessType !== undefined) updates.businessType = req.businessType
  if (req.phone !== undefined) updates.phone = localPhoneDigits(req.phone)
  if (req.countryCode !== undefined) updates.countryCode = req.countryCode
  if (req.email !== undefined) updates.email = req.email
  if (req.address !== undefined) updates.address = req.address
  if (req.whatsappDeviceId !== undefined) updates.whatsappDeviceId = req.whatsappDeviceId
  if (req.iconFilename !== undefined) updates.iconFilename = req.iconFilename

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

  return row ? deps.toEntity(row) : null
}
