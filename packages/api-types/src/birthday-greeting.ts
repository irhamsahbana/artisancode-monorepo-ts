// ponytail: single-row settings (not a list) — separate from BroadcastTemplate,
// which represents one-off campaigns. Birthday greetings recur daily.
export interface BirthdayGreetingSettings {
  id: string
  message: string
  enabled: boolean
  audienceGender?: 'male' | 'female'
  audienceReligion?: string
  audienceSegmentationId?: string
  audienceCustomerStatus?: string
  updatedAt: string
}

export interface UpdateBirthdayGreetingSettingsReq {
  message?: string
  enabled?: boolean
  audienceGender?: 'male' | 'female'
  audienceReligion?: string
  audienceSegmentationId?: string
  audienceCustomerStatus?: string
}

export interface BirthdayGreetingRecipientLog {
  contactId: string
  contactName: string
  status: 'sent' | 'failed'
  sentAt?: string
  errorMessage?: string
}

export interface BirthdayGreetingLog {
  id: string
  sentAt: string
  recipientCount: number
  recipientLogs: BirthdayGreetingRecipientLog[]
}
