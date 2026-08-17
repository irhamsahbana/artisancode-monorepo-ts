import { boolean, index, pgTable, text, unique } from 'drizzle-orm/pg-core'

import { defaultId, softDelete, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// Role
// ---------------------------------------------------------------------------
export const roles = pgTable(
  'roles',
  {
    id: defaultId,
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    // ponytail: protects seeded/system roles from deletion, same idea as
    // users.isProtected — set at seed time only, no admin UI to toggle it.
    isSystem: boolean('is_system').notNull().default(false),
    ...timestamps,
    ...softDelete,
  },
  (t) => [index('roles_deleted_at_idx').on(t.deletedAt), unique('roles_name_unique').on(t.name)],
)
