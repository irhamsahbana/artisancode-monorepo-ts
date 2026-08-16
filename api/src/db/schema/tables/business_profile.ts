import { pgTable, text } from 'drizzle-orm/pg-core'

import { defaultId, softDelete, timestamps } from './helpers'

// ---------------------------------------------------------------------------
// BusinessProfile (single-row: the company running this CRM)
// ---------------------------------------------------------------------------
export const businessProfiles = pgTable('business_profiles', {
  id: defaultId,
  name: text('name').notNull(),
  businessType: text('business_type'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  ...timestamps,
  ...softDelete,
})
