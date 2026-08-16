import { PaginationMetadata, PaginationQuery } from './pagination.entity'

export type QuotationStatus = 'new' | 'in_review' | 'responded'

export const QuotationStatuses: QuotationStatus[] = ['new', 'in_review', 'responded']

export interface QuotationProductLine {
  productName: string
  specification?: string
  quantity?: string
}

export interface QuotationRequest {
  id: string
  title: string | null
  projectId: string | null
  topic: string | null
  requesterName: string
  companyName: string | null
  whatsapp: string
  email: string | null
  products: QuotationProductLine[]
  notes: string | null
  status: QuotationStatus
  createdAt: Date
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

export interface UpdateQuotationStatusReq {
  id: string
  status: QuotationStatus
}

export interface AssignQuotationReq {
  id: string
  projectId: string
}

export interface QuotationList {
  items: QuotationRequest[]
  pagination: PaginationMetadata
}

export interface GetQuotationListReq {
  q?: string
  status?: QuotationStatus
  pagination?: PaginationQuery
}
