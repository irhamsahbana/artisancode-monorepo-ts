import { PaginationMetadata } from './pagination.entity'

export type RiskLevel = 'low' | 'medium' | 'high'

export const RiskLevels: RiskLevel[] = ['low', 'medium', 'high']

export interface CustomerRating {
  id: string
  customerId: string
  contactId: string | null
  ratingDate: string
  paymentScore: number // 1-5
  relationshipScore: number // 1-5
  problemNotes: string | null
  riskLevel: RiskLevel
  notes: string | null
  createdAt: Date
  updatedAt: Date
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
  page?: number
  per_page?: number
}

export interface CustomerRatingList {
  items: CustomerRating[]
  pagination: PaginationMetadata
}
