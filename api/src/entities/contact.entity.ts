import { Customer } from './customer.entity'
import { PaginationMetadata, PaginationQuery } from './pagination.entity'

export interface Contact {
  id: string
  customerId: string
  name: string
  position: string | null
  whatsapp: string | null
  countryCode: string
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
  country_code?: string
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
  country_code?: string
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

// One row per (contact, customer) — same person listed at multiple companies
// yields multiple rows, matching web/src/services/contact.ts's mockSearch.
export interface ContactSearchResult {
  contact: Contact
  customer: Customer
}

export interface SearchContactsReq {
  q?: string
  pagination?: PaginationQuery
  // Server-side filters for contact search
  gender?: string
  religion?: string
  segmentationId?: string
  customerStatus?: string
}

// Contact search results grouped by person (name) so someone who appears at
// multiple companies ("pinjam perusahaan") lands in one group with every
// related company, instead of one row per (contact, customer) pair.
export interface ContactPersonGroup {
  name: string
  entries: ContactSearchResult[]
}

export interface ContactPersonGroupList {
  items: ContactPersonGroup[]
  pagination: PaginationMetadata
}
