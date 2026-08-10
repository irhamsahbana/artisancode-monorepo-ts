import type { PaginationMetadata } from './common'

export type RiskLevel = 'low' | 'medium' | 'high'

export interface CustomerRating {
  id: string
  customerId: string
  contactId?: string // key person the relationshipScore is about
  ratingDate: string
  paymentScore: number // 1-5 (cara bayar)
  relationshipScore: number // 1-5
  problemNotes?: string // bermasalah/tdk
  riskLevel: RiskLevel
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerRatingReq {
  customerId: string
  contactId?: string
  ratingDate: string
  paymentScore: number
  relationshipScore: number
  problemNotes?: string
  riskLevel: RiskLevel
  notes?: string
}

export interface GetCustomerRatingReq {
  customerId?: string
  contactId?: string
}

export interface CustomerRatingList {
  items: CustomerRating[]
  pagination: PaginationMetadata
}
