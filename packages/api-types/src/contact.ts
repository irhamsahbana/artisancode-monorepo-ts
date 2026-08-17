import type { PaginationMetadata } from './common'
import type { Customer } from './customer'

export interface Contact {
  id: string
  customerId: string
  name: string
  position?: string
  whatsapp?: string
  countryCode?: string
  email?: string
  gender?: 'male' | 'female'
  birthPlace?: string
  dateOfBirth?: string
  religion?: string
  education?: string
  address?: string
  // family
  spouseName?: string
  spouseOccupation?: string
  childrenNames?: string
  childrenOccupation?: string
  notes?: string
  isPrimary: boolean
  // manual free-text, sales-authored (see key-person-profile-view task)
  profiling?: string
  createdAt: string
  updatedAt: string
}

export interface CreateContactReq {
  customerId: string
  name: string
  position?: string
  whatsapp?: string
  countryCode?: string
  email?: string
  gender?: 'male' | 'female'
  birthPlace?: string
  dateOfBirth?: string
  religion?: string
  education?: string
  address?: string
  spouseName?: string
  spouseOccupation?: string
  childrenNames?: string
  childrenOccupation?: string
  notes?: string
  isPrimary?: boolean
  profiling?: string
}

export interface UpdateContactReq {
  name?: string
  position?: string
  whatsapp?: string
  countryCode?: string
  email?: string
  gender?: 'male' | 'female'
  birthPlace?: string
  dateOfBirth?: string
  religion?: string
  education?: string
  address?: string
  spouseName?: string
  spouseOccupation?: string
  childrenNames?: string
  childrenOccupation?: string
  notes?: string
  isPrimary?: boolean
  profiling?: string
}

// ponytail: demo search-by-person. One row per (contact, customer) occurrence
// so the same person appearing at multiple companies ("pinjam perusahaan")
// yields multiple rows the UI groups by name. Proper Person entity = backend.
export interface ContactSearchResult {
  contact: Contact
  customer: Customer
}

export interface GetContactReq {
  q?: string
  customerId?: string
  isPrimary?: boolean
}

// Key Person directory: contact search results grouped by person (name),
// paginated by group count so one person's full company list always lands
// on a single page. See ContactSearchResult for the flat, ungrouped shape
// used by pickers.
export interface ContactPersonGroup {
  name: string
  entries: ContactSearchResult[]
}

export interface ContactPersonGroupList {
  items: ContactPersonGroup[]
  pagination: PaginationMetadata
}
