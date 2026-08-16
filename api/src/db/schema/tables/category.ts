import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { statusEnum } from '../enums'
import { defaultId, softDelete, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// Category (self-referential hierarchy)
// ---------------------------------------------------------------------------
export const categories = pgTable(
  'categories',
  {
    id: defaultId,
    parentId: uuid('parent_id'),
    group: text('group').notNull().default(''),
    name: text('name').notNull().default(''),
    status: statusEnum('status').notNull().default('active'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [index('categories_group_idx').on(t.group), index('categories_status_idx').on(t.status)],
)
