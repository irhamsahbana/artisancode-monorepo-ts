import { boolean, json, pgTable, text } from 'drizzle-orm/pg-core'

import { defaultId, timestamps } from './helpers'

export const webhookLogs = pgTable('webhook_logs', {
  id: defaultId,
  headers: json('headers').notNull(),
  body: text('body').notNull(),
  targetPath: text('target_path').notNull(),
  isValid: boolean('is_valid').notNull().default(false),
  errorMessage: text('error_message'),
  invoiceNumber: text('invoice_number'),
  paymentStatus: text('payment_status'),
  createdAt: timestamps.createdAt,
})
