import { boolean, jsonb, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { genderEnum } from '../enums'
import { categories } from './category'
import { defaultId, softDelete, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// BirthdayGreetingSettings (single-row: the org's recurring WhatsApp
// birthday greeting config — separate from one-off BroadcastTemplate campaigns)
// ---------------------------------------------------------------------------
export const birthdayGreetingSettings = pgTable('birthday_greeting_settings', {
  id: defaultId,
  message: text('message').notNull(),
  enabled: boolean('enabled').notNull().default(false),
  audienceGender: genderEnum('audience_gender'),
  audienceReligion: text('audience_religion'),
  audienceSegmentationId: uuid('audience_segmentation_id').references(() => categories.id),
  audienceCustomerStatus: text('audience_customer_status'),
  ...timestamps,
  ...softDelete,
})

export interface BirthdayGreetingRecipientLogRow {
  contactId: string
  contactName: string
  status: 'sent' | 'failed'
  sentAt?: string
  errorMessage?: string
}

// One row per day the scheduler actually found a birthday match and sent.
export const birthdayGreetingLogs = pgTable('birthday_greeting_logs', {
  id: defaultId,
  sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
  recipientCount: numeric('recipient_count').notNull(),
  recipientLogs: jsonb('recipient_logs')
    .$type<BirthdayGreetingRecipientLogRow[]>()
    .notNull()
    .default([]),
  ...timestamps,
})
