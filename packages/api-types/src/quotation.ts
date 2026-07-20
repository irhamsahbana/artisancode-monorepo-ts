import type { PaginationMetadata } from './common'

export type QuotationStatus = 'new' | 'in_review' | 'responded'

export interface QuotationRequest {
  id: string
  requesterName: string
  companyName?: string
  whatsapp: string
  email?: string
  productName?: string
  specification?: string
  quantity?: string
  notes?: string
  status: QuotationStatus
  createdAt: string
}

export interface CreateQuotationReq {
  requesterName: string
  companyName?: string
  whatsapp: string
  email?: string
  productName?: string
  specification?: string
  quantity?: string
  notes?: string
}

export interface QuotationList {
  items: QuotationRequest[]
  pagination: PaginationMetadata
}
