import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { birthdayGreetingSettings } from '@/db/schema'
import * as Entity from '@/entities/birthday_greeting.entity'

import type { BirthdayGreetingRepoDeps } from '../birthday_greeting.repo'

export async function updateBirthdayGreeting(
  deps: BirthdayGreetingRepoDeps,
  req: Entity.UpdateBirthdayGreetingSettingsReq,
): Promise<Entity.BirthdayGreetingSettings | null> {
  const updates: Partial<typeof birthdayGreetingSettings.$inferInsert> = {
    updatedAt: sql`now()` as unknown as Date,
  }

  if (req.message !== undefined) updates.message = req.message
  if (req.enabled !== undefined) updates.enabled = req.enabled
  if (req.audienceGender !== undefined) updates.audienceGender = req.audienceGender
  if (req.audienceReligion !== undefined) updates.audienceReligion = req.audienceReligion
  if (req.audienceSegmentationId !== undefined)
    updates.audienceSegmentationId = req.audienceSegmentationId
  if (req.audienceCustomerStatus !== undefined)
    updates.audienceCustomerStatus = req.audienceCustomerStatus

  const [existing] = await getExecutor()
    .select({ id: birthdayGreetingSettings.id })
    .from(birthdayGreetingSettings)
    .where(isNull(birthdayGreetingSettings.deletedAt))
    .limit(1)

  const [row] = existing
    ? await getExecutor()
        .update(birthdayGreetingSettings)
        .set(updates)
        .where(
          and(
            eq(birthdayGreetingSettings.id, existing.id),
            isNull(birthdayGreetingSettings.deletedAt),
          ),
        )
        .returning()
    : await getExecutor()
        .insert(birthdayGreetingSettings)
        .values({ message: req.message ?? '', ...updates })
        .returning()

  return row ? deps.settingsToEntity(row) : null
}
