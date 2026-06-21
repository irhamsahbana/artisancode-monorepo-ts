export interface Contact {
  id: string
  customerId: string
  name: string
  position?: string
  whatsapp?: string
  email?: string
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
  notes?: string
  isPrimary?: boolean
}

export interface UpdateContactReq {
  name?: string
  position?: string
  whatsapp?: string
  email?: string
  notes?: string
  isPrimary?: boolean
}
