import type { Customer } from './customer'

export interface Contact {
  id: string
  customerId: string
  name: string
  position?: string
  whatsapp?: string
  email?: string
  gender?: 'male' | 'female'
  religion?: string
  notes?: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateContactReq {
  customerId: string
  name: string
  position?: string
  whatsapp?: string
  email?: string
  gender?: 'male' | 'female'
  religion?: string
  notes?: string
  isPrimary?: boolean
}

export interface UpdateContactReq {
  name?: string
  position?: string
  whatsapp?: string
  email?: string
  gender?: 'male' | 'female'
  religion?: string
  notes?: string
  isPrimary?: boolean
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
