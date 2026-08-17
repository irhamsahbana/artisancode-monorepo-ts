import { and, desc, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IBirthdayGreetingRepo } from '@/contracts/birthday_greeting.contract'
import { birthdayGreetingLogs, birthdayGreetingSettings } from '@/db/schema'
import * as Entity from '@/entities/birthday_greeting.entity'

function settingsToEntity(
  data: typeof birthdayGreetingSettings.$inferSelect,
): Entity.BirthdayGreetingSettings {
  return {
    id: data.id,
    message: data.message,
    enabled: data.enabled,
    audienceGender: data.audienceGender,
    audienceReligion: data.audienceReligion,
    audienceSegmentationId: data.audienceSegmentationId,
    audienceCustomerStatus: data.audienceCustomerStatus,
    updatedAt: data.updatedAt,
  }
}

function logToEntity(data: typeof birthdayGreetingLogs.$inferSelect): Entity.BirthdayGreetingLog {
  return {
    id: data.id,
    sentAt: data.sentAt,
    recipientCount: Number(data.recipientCount),
    recipientLogs: data.recipientLogs,
  }
}

export function createBirthdayGreetingRepo(): IBirthdayGreetingRepo {
  return {
    find: async () => {
      const [row] = await getExecutor()
        .select()
        .from(birthdayGreetingSettings)
        .where(isNull(birthdayGreetingSettings.deletedAt))
        .limit(1)
      return row ? settingsToEntity(row) : null
    },

    update: async (req) => {
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

      // Upsert against the single row
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

      return row ? settingsToEntity(row) : null
    },

    findLogs: async () => {
      const rows = await getExecutor()
        .select()
        .from(birthdayGreetingLogs)
        .orderBy(desc(birthdayGreetingLogs.sentAt))
      return rows.map(logToEntity)
    },

    recordSend: async (recipientLogs) => {
      const [row] = await getExecutor()
        .insert(birthdayGreetingLogs)
        .values({
          recipientCount: String(recipientLogs.length),
          recipientLogs,
        })
        .returning()
      return logToEntity(row)
    },
  }
}
