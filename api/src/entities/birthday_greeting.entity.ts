export interface BirthdayGreetingSettings {
  id: string
  message: string
  enabled: boolean
  audienceGender: 'male' | 'female' | null
  audienceReligion: string | null
  audienceSegmentationId: string | null
  audienceCustomerStatus: string | null
  updatedAt: Date
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
  sentAt: Date
  recipientCount: number
  recipientLogs: BirthdayGreetingRecipientLog[]
}
