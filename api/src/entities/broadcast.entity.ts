import { PaginationMetadata } from './pagination.entity'

export type BroadcastOccasion =
  | 'idul_fitri'
  | 'idul_adha'
  | 'christmas'
  | 'new_year'
  | 'national_day'
  | 'company_anniversary'
  | 'thank_you'
  | 'custom'

export const BroadcastOccasions: BroadcastOccasion[] = [
  'idul_fitri',
  'idul_adha',
  'christmas',
  'new_year',
  'national_day',
  'company_anniversary',
  'thank_you',
  'custom',
]

export interface PerContactLog {
  contactId: string
  contactName: string
  status: 'pending' | 'sent' | 'failed'
  sentAt?: string
  errorMessage?: string
}

export interface BroadcastTemplate {
  id: string
  name: string
  message: string
  occasion: BroadcastOccasion
  audienceGender: 'male' | 'female' | null
  audienceReligion: string | null
  audienceSegmentationId: string | null
  audienceCustomerStatus: string | null
  scheduledAt: Date | null
  sentAt: Date | null
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  createdAt: Date
}

export interface BroadcastLog {
  id: string
  templateId: string
  sentAt: Date
  recipientCount: number
  status: 'pending' | 'sent' | 'failed'
  recipientLogs: PerContactLog[]
}

export interface CreateBroadcastTemplateReq {
  name: string
  message: string
  occasion: BroadcastOccasion
  audienceGender?: 'male' | 'female'
  audienceReligion?: string
  audienceSegmentationId?: string
  audienceCustomerStatus?: string
  scheduledAt?: string
}

export interface SendBroadcastReq {
  templateId: string
}

/** Immediate ack while actual sending runs in the background */
export interface SendBroadcastRes {
  templateId: string
  recipientCount: number
  provider: string
}

export interface BroadcastList {
  items: BroadcastTemplate[]
  pagination: PaginationMetadata
}
