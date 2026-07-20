import type { PaginationMetadata } from './common'

export type BroadcastOccasion =
  | 'idul_fitri'
  | 'idul_adha'
  | 'christmas'
  | 'new_year'
  | 'national_day'
  | 'company_anniversary'
  | 'thank_you'
  | 'custom'

// ponytail: broadcast targets Contacts (key persons), not Customer companies.
// Filters combine key-person attributes with their company's attributes.
export interface BroadcastTemplate {
  id: string
  name: string
  message: string
  occasion: BroadcastOccasion
  audienceGender?: 'male' | 'female'
  audienceReligion?: string
  audienceSegmentationId?: string
  audienceCustomerStatus?: string
  scheduledAt?: string // ISO datetime when broadcast should be sent
  sentAt?: string // ISO datetime when actually sent
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  createdAt: string
}

export interface BroadcastLog {
  id: string
  templateId: string
  sentAt: string
  recipientCount: number
  status: 'pending' | 'sent' | 'failed'
  // Per-contact tracking
  recipientLogs?: PerContactLog[]
}

export interface PerContactLog {
  contactId: string
  contactName: string
  status: 'pending' | 'sent' | 'failed'
  sentAt?: string
  errorMessage?: string
}

export interface CreateBroadcastTemplateReq {
  name: string
  message: string
  occasion: BroadcastOccasion
  audienceGender?: 'male' | 'female'
  audienceReligion?: string
  audienceSegmentationId?: string
  audienceCustomerStatus?: string
  scheduledAt?: string // ISO datetime, if omitted means "send now"
}

export interface BroadcastList {
  items: BroadcastTemplate[]
  pagination: PaginationMetadata
}
