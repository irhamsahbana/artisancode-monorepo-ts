import type { PaginationMetadata, PaginationQuery } from './common'

export type CustomerType = 'individual' | 'business'
export type CustomerStatus = 'prospect' | 'active' | 'inactive'
export type CustomerPotential = 'high' | 'medium' | 'low'

export interface Customer {
  id: string
  name: string
  type: CustomerType
  categoryId: string
  segmentationId: string
  areaId: string
  status: CustomerStatus
  potential: CustomerPotential
  hasContractHistory: boolean
  lastRevenue?: number
  lastContractYear?: number
  primaryContactId?: string
  // personal
  gender?: 'male' | 'female'
  address?: string
  birthPlace?: string
  dateOfBirth?: string
  religion?: string
  education?: string
  email?: string
  // family
  spouseName?: string
  spouseOccupation?: string
  childrenNames?: string
  childrenOccupation?: string
  // traits
  character?: string
  hobby?: string
  // company
  companyName?: string
  position?: string
  companyAddress?: string
  whatsapp?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerReq {
  name: string
  type: CustomerType
  categoryId: string
  segmentationId: string
  areaId: string
  status?: CustomerStatus
  potential?: CustomerPotential
  hasContractHistory?: boolean
  lastRevenue?: number
  lastContractYear?: number
  gender?: 'male' | 'female'
  address?: string
  birthPlace?: string
  dateOfBirth?: string
  religion?: string
  education?: string
  email?: string
  spouseName?: string
  spouseOccupation?: string
  childrenNames?: string
  childrenOccupation?: string
  character?: string
  hobby?: string
  companyName?: string
  position?: string
  companyAddress?: string
  whatsapp?: string
  notes?: string
}

export interface UpdateCustomerReq {
  name?: string
  type?: CustomerType
  categoryId?: string
  segmentationId?: string
  areaId?: string
  status?: CustomerStatus
  potential?: CustomerPotential
  hasContractHistory?: boolean
  lastRevenue?: number
  lastContractYear?: number
  gender?: 'male' | 'female'
  address?: string
  birthPlace?: string
  dateOfBirth?: string
  religion?: string
  education?: string
  email?: string
  spouseName?: string
  spouseOccupation?: string
  childrenNames?: string
  childrenOccupation?: string
  character?: string
  hobby?: string
  companyName?: string
  position?: string
  companyAddress?: string
  whatsapp?: string
  notes?: string
}

export interface GetCustomerReq {
  q?: string
  type?: CustomerType
  status?: CustomerStatus
  potential?: CustomerPotential
  categoryId?: string
  segmentationId?: string
  areaId?: string
  hasContractHistory?: boolean
  pagination?: PaginationQuery
}

export interface CustomerList {
  items: Customer[]
  pagination: PaginationMetadata
}
