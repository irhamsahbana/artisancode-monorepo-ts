import { index, pgTable, text } from 'drizzle-orm/pg-core'

import { statusEnum } from '../enums'
import { defaultId, softDelete, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// Product (CRM catalog item, e.g. "Beton K-250" with unit "m3")
// ---------------------------------------------------------------------------
export const products = pgTable(
  'products',
  {
    id: defaultId,
    name: text('name').notNull(),
    unit: text('unit').notNull().default(''),
    status: statusEnum('status').notNull().default('active'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    index('products_status_deleted_at_idx').on(t.status, t.deletedAt),
    index('products_name_idx').on(t.name),
  ],
)
