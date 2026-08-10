import type { PaginationMetadata } from './common'

export type QuotationStatus = 'new' | 'in_review' | 'responded'

export interface QuotationProductLine {
  productName: string
  specification?: string
  quantity?: string
}

export interface QuotationRequest {
  id: string
  title?: string
  projectId?: string
  topic?: string
  requesterName: string
  companyName?: string
  whatsapp: string
  email?: string
  products?: QuotationProductLine[]
  notes?: string
  status: QuotationStatus
  createdAt: string
}

export interface CreateQuotationReq {
  title?: string
  projectId?: string
  topic?: string
  requesterName: string
  companyName?: string
  whatsapp: string
  email?: string
  products?: QuotationProductLine[]
  notes?: string
}

export interface AssignQuotationReq {
  projectId: string
}

export interface QuotationList {
  items: QuotationRequest[]
  pagination: PaginationMetadata
}
