import { Customer } from './customer.entity'
import { PaginationMetadata, PaginationQuery } from './pagination.entity'

export type Gender = 'male' | 'female'

export interface Contact {
  id: string
  customerId: string
  name: string
  position: string | null
  whatsapp: string | null
  countryCode: string
  email: string | null
  gender: Gender | null
  birthPlace: string | null
  dateOfBirth: string | null
  religion: string | null
  education: string | null
  address: string | null
  spouseName: string | null
  spouseOccupation: string | null
  childrenNames: string | null
  childrenOccupation: string | null
  profiling: string | null
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
  gender?: Gender
  birthPlace?: string
  dateOfBirth?: string
  religion?: string
  education?: string
  address?: string
  spouseName?: string
  spouseOccupation?: string
  childrenNames?: string
  childrenOccupation?: string
  profiling?: string
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
  gender?: Gender
  birthPlace?: string
  dateOfBirth?: string
  religion?: string
  education?: string
  address?: string
  spouseName?: string
  spouseOccupation?: string
  childrenNames?: string
  childrenOccupation?: string
  profiling?: string
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
  // Server-side filters for contact search — gender/religion are the
  // contact's own (personal fields live on contacts, not customers).
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
