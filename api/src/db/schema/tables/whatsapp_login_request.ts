import { index, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'

import { defaultId, timestamps } from './helpers'
import { users } from './user'

// ---------------------------------------------------------------------------
// WhatsAppLoginRequest (passwordless login — verified when the user WhatsApps
// a confirmation keyword + token to the business number and gowa relays that
// incoming message to our webhook)
// ---------------------------------------------------------------------------
export const whatsappLoginRequests = pgTable(
  'whatsapp_login_requests',
  {
    id: defaultId,
    phone: text('phone').notNull(),
    // Null when the phone doesn't match any user — kept so request() always
    // behaves identically and never leaks which phone numbers are valid.
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    confirmToken: text('confirm_token').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    unique('whatsapp_login_requests_confirm_token_unique').on(t.confirmToken),
    index('whatsapp_login_requests_phone_idx').on(t.phone),
  ],
)
