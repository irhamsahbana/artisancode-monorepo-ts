import { boolean, index, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { genderEnum } from '../enums'
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
    countryCode: text('country_code').notNull().default('62'),
    email: text('email'),
    // personal — the key person's own data, not the company's
    gender: genderEnum('gender'),
    birthPlace: text('birth_place'),
    dateOfBirth: text('date_of_birth'),
    religion: text('religion'),
    education: text('education'),
    address: text('address'),
    // family
    spouseName: text('spouse_name'),
    spouseOccupation: text('spouse_occupation'),
    childrenNames: text('children_names'),
    childrenOccupation: text('children_occupation'),
    // manual free-text, sales-authored
    profiling: text('profiling'),
    notes: text('notes'),
    isPrimary: boolean('is_primary').notNull().default(false),
    ...timestamps,
    ...softDelete,
  },
  (t) => [index('contacts_customer_id_deleted_at_idx').on(t.customerId, t.deletedAt)],
)
