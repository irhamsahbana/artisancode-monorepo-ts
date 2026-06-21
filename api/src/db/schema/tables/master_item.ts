import { boolean, index, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { masterItemTypeEnum } from '../enums'
import { companies } from './company'
import { defaultId, softDelete, timestamps } from './helpers'

export const masterItems = pgTable(
  'master_items',
  {
    id: defaultId,
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id),
    type: masterItemTypeEnum('type').notNull(),
    name: text('name').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    index('master_items_company_id_type_deleted_at_idx').on(t.companyId, t.type, t.deletedAt),
  ],
)
