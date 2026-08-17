import { pgEnum } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('status', ['active', 'inactive'])

export const customerTypeEnum = pgEnum('customer_type', ['individual', 'business'])

export const customerStatusEnum = pgEnum('customer_status', ['prospect', 'active', 'inactive'])

export const customerPotentialEnum = pgEnum('customer_potential', ['high', 'medium', 'low'])

export const genderEnum = pgEnum('gender', ['male', 'female'])

export const uomCategoryEnum = pgEnum('uom_category', [
  'length',
  'area',
  'volume',
  'mass',
  'time',
  'quantity',
  'other',
])

export const projectStatusEnum = pgEnum('project_status', [
  'prospect',
  'in_progress',
  'won',
  'lost',
])

export const quotationStatusEnum = pgEnum('quotation_status', ['new', 'in_review', 'responded'])

export const riskLevelEnum = pgEnum('risk_level', ['low', 'medium', 'high'])

export const broadcastOccasionEnum = pgEnum('broadcast_occasion', [
  'idul_fitri',
  'idul_adha',
  'christmas',
  'new_year',
  'national_day',
  'company_anniversary',
  'thank_you',
  'birthday',
  'custom',
])

export const broadcastStatusEnum = pgEnum('broadcast_status', [
  'draft',
  'scheduled',
  'sent',
  'failed',
])

export const broadcastLogStatusEnum = pgEnum('broadcast_log_status', ['pending', 'sent', 'failed'])
