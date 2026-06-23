import { boolean, index, integer, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { customerPotentialEnum, customerStatusEnum, customerTypeEnum, genderEnum } from '../enums'
import { categories } from './category'
import { companies } from './company'
import { defaultId, softDelete, timestamps } from './helpers'

export const customers = pgTable(
  'customers',
  {
    id: defaultId,
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id),
    name: text('name').notNull(),
    type: customerTypeEnum('type').notNull(),
    categoryId: uuid('category_id').references(() => categories.id),
    segmentationId: uuid('segmentation_id').references(() => categories.id),
    areaId: uuid('area_id').references(() => categories.id),
    status: customerStatusEnum('status').notNull().default('prospect'),
    potential: customerPotentialEnum('potential').notNull().default('medium'),
    hasContractHistory: boolean('has_contract_history').notNull().default(false),
    lastRevenue: numeric('last_revenue'),
    lastContractYear: integer('last_contract_year'),
    // primaryContactId is set after contacts are created; no strict FK to avoid circular dep
    primaryContactId: uuid('primary_contact_id'),
    // personal
    gender: genderEnum('gender'),
    address: text('address'),
    birthPlace: text('birth_place'),
    dateOfBirth: text('date_of_birth'),
    religion: text('religion'),
    education: text('education'),
    email: text('email'),
    // family
    spouseName: text('spouse_name'),
    spouseOccupation: text('spouse_occupation'),
    childrenNames: text('children_names'),
    childrenOccupation: text('children_occupation'),
    // traits
    character: text('character'),
    hobby: text('hobby'),
    // company info
    companyName: text('company_name'),
    position: text('position'),
    companyAddress: text('company_address'),
    whatsapp: text('whatsapp'),
    notes: text('notes'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [index('customers_company_id_deleted_at_idx').on(t.companyId, t.deletedAt)],
)
