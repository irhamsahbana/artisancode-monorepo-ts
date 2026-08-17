import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { statusEnum } from '../enums'
import { defaultId, softDelete, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
export const users = pgTable('users', {
  id: defaultId,
  roleId: uuid('role_id').notNull(),
  name: text('name').notNull().default(''),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone').notNull().default(''),
  countryCode: text('country_code').notNull().default('62'),
  status: statusEnum('status').notNull().default('active'),
  isProtected: boolean('is_protected').notNull().default(false),
  ...timestamps,
  ...softDelete,
})
