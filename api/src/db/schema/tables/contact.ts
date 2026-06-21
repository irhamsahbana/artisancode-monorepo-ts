import { boolean, index, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { customers } from './customer'
import { defaultId, softDelete, timestamps } from './helpers'

export const contacts = pgTable(
  'contacts',
  {
    id: defaultId,
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id),
    name: text('name').notNull(),
    position: text('position'),
    whatsapp: text('whatsapp'),
    email: text('email'),
    notes: text('notes'),
    isPrimary: boolean('is_primary').notNull().default(false),
    ...timestamps,
    ...softDelete,
  },
  (t) => [index('contacts_customer_id_deleted_at_idx').on(t.customerId, t.deletedAt)],
)
