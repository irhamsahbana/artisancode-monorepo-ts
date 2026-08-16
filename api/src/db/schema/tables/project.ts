import { index, jsonb, numeric, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'

import { projectStatusEnum, quotationStatusEnum, riskLevelEnum } from '../enums'
import { contacts } from './contact'
import { customers } from './customer'
import { defaultId, softDelete, timestamps } from './helpers'

export interface ProjectProductLineRow {
  productId: string
  quantity: number
}

// ---------------------------------------------------------------------------
// Project (construction opportunity for a customer)
// ---------------------------------------------------------------------------
export const projects = pgTable(
  'projects',
  {
    id: defaultId,
    projectNumber: text('project_number').notNull(),
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id),
    contactId: uuid('contact_id').references(() => contacts.id),
    name: text('name').notNull(),
    location: text('location'),
    latitude: numeric('latitude'),
    longitude: numeric('longitude'),
    sourceOfFunds: text('source_of_funds'),
    picName: text('pic_name'),
    status: projectStatusEnum('status').notNull().default('prospect'),
    estimatedValue: numeric('estimated_value'),
    spkNumber: text('spk_number'),
    lostReason: text('lost_reason'),
    winnerCompetitor: text('winner_competitor'),
    products: jsonb('products').$type<ProjectProductLineRow[]>().notNull().default([]),
    notes: text('notes'),
    ...timestamps,
    ...softDelete,
  },
  (t) => [
    unique('projects_project_number_unique').on(t.projectNumber),
    index('projects_customer_id_deleted_at_idx').on(t.customerId, t.deletedAt),
    index('projects_status_idx').on(t.status),
  ],
)

// ---------------------------------------------------------------------------
// ProjectVisit (site visit log)
// ---------------------------------------------------------------------------
export const projectVisits = pgTable(
  'project_visits',
  {
    id: defaultId,
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    visitDate: text('visit_date').notNull(), // ISO date (YYYY-MM-DD)
    metWith: text('met_with'),
    topic: text('topic'),
    notes: text('notes'),
    ...timestamps,
  },
  (t) => [index('project_visits_project_id_idx').on(t.projectId)],
)

export interface QuotationProductLineRow {
  productName: string
  specification?: string
  quantity?: string
}

// ---------------------------------------------------------------------------
// QuotationRequest (public web form submission)
// ---------------------------------------------------------------------------
export const quotations = pgTable(
  'quotations',
  {
    id: defaultId,
    title: text('title'),
    projectId: uuid('project_id').references(() => projects.id),
    topic: text('topic'),
    requesterName: text('requester_name').notNull(),
    companyName: text('company_name'),
    whatsapp: text('whatsapp').notNull(),
    email: text('email'),
    products: jsonb('products').$type<QuotationProductLineRow[]>().notNull().default([]),
    notes: text('notes'),
    status: quotationStatusEnum('status').notNull().default('new'),
    ...timestamps,
  },
  (t) => [index('quotations_status_idx').on(t.status)],
)

// ---------------------------------------------------------------------------
// CustomerRating (payment & relationship scoring)
// ---------------------------------------------------------------------------
export const customerRatings = pgTable(
  'customer_ratings',
  {
    id: defaultId,
    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id').references(() => contacts.id),
    ratingDate: text('rating_date').notNull(), // ISO date (YYYY-MM-DD)
    paymentScore: numeric('payment_score').notNull(), // 1-5
    relationshipScore: numeric('relationship_score').notNull(), // 1-5
    problemNotes: text('problem_notes'),
    riskLevel: riskLevelEnum('risk_level').notNull(),
    notes: text('notes'),
    ...timestamps,
  },
  (t) => [
    index('customer_ratings_customer_id_idx').on(t.customerId),
    index('customer_ratings_contact_id_idx').on(t.contactId),
  ],
)
