import { index, pgTable, text } from 'drizzle-orm/pg-core'

import { statusEnum } from '../enums'
import { defaultId, softDelete, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// Company
// ---------------------------------------------------------------------------
export const companies = pgTable(
  'companies',
  {
    id: defaultId,
    name: text('name').notNull().default(''),
    status: statusEnum('status').notNull().default('active'),
    // business profile fields
    businessType: text('business_type'),
    phone: text('phone'),
    email: text('email'),
    address: text('address'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    index('companies_status_idx').on(t.status),
    index('companies_deleted_at_idx').on(t.deletedAt),
  ],
)
