import { index, jsonb, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import {
  broadcastLogStatusEnum,
  broadcastOccasionEnum,
  broadcastStatusEnum,
  genderEnum,
} from '../enums'
import { categories } from './category'
import { defaultId, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// BroadcastTemplate (audience-filtered message for key persons)
// ---------------------------------------------------------------------------
export const broadcastTemplates = pgTable(
  'broadcast_templates',
  {
    id: defaultId,
    name: text('name').notNull(),
    message: text('message').notNull(),
    occasion: broadcastOccasionEnum('occasion').notNull().default('custom'),
    audienceGender: genderEnum('audience_gender'),
    audienceReligion: text('audience_religion'),
    audienceSegmentationId: uuid('audience_segmentation_id').references(() => categories.id),
    audienceCustomerStatus: text('audience_customer_status'),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    status: broadcastStatusEnum('status').notNull().default('draft'),
    ...timestamps,
  },
  (t) => [index('broadcast_templates_status_idx').on(t.status)],
)

export interface PerContactLogRow {
  contactId: string
  contactName: string
  status: 'pending' | 'sent' | 'failed'
  sentAt?: string
  errorMessage?: string
}

// ---------------------------------------------------------------------------
// BroadcastLog (one row per send attempt, per-contact tracking in JSONB)
// ---------------------------------------------------------------------------
export const broadcastLogs = pgTable(
  'broadcast_logs',
  {
    id: defaultId,
    templateId: uuid('template_id')
      .notNull()
      .references(() => broadcastTemplates.id, { onDelete: 'cascade' }),
    sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
    recipientCount: numeric('recipient_count').notNull(),
    status: broadcastLogStatusEnum('status').notNull().default('pending'),
    recipientLogs: jsonb('recipient_logs').$type<PerContactLogRow[]>().notNull().default([]),
    ...timestamps,
  },
  (t) => [index('broadcast_logs_template_id_idx').on(t.templateId)],
)
