import { boolean, index, integer, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { companyTypeEnum, customerPotentialEnum, customerStatusEnum } from '../enums'
import { categories } from './category'
import { defaultId, softDelete, timestamps } from './helpers'

export const customers = pgTable(
  'customers',
  {
    id: defaultId,
    name: text('name').notNull(),
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
    // client taxonomy — BUMN / swasta nasional / swasta asing
    companyType: companyTypeEnum('company_type'),
    address: text('address'),
    npwp: text('npwp'),
    skt: text('skt'),
    companyEmail: text('company_email'),
    website: text('website'),
    notes: text('notes'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [index('customers_deleted_at_idx').on(t.deletedAt)],
)
