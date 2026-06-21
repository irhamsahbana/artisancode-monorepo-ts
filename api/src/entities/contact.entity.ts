import { PaginationMetadata, PaginationQuery } from './pagination.entity'

export interface Contact {
  id: string
  customerId: string
  name: string
  position: string | null
  whatsapp: string | null
  email: string | null
  notes: string | null
  isPrimary: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CreateContactReq {
  customer_id: string
  name: string
  position?: string
  whatsapp?: string
  email?: string
  notes?: string
  isPrimary?: boolean
}

export interface UpdateContactReq {
  id: string
  customer_id: string
  name?: string
  position?: string
  whatsapp?: string
  email?: string
  notes?: string
  isPrimary?: boolean
}

export interface GetContactReq {
  customer_id: string
  pagination?: PaginationQuery
}

export interface ContactList {
  items: Contact[]
  pagination: PaginationMetadata
}
