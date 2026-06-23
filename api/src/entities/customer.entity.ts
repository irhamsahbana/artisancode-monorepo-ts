import { PaginationMetadata, PaginationQuery } from './pagination.entity'

export type CustomerType = 'individual' | 'business'
export type CustomerStatus = 'prospect' | 'active' | 'inactive'
export type CustomerPotential = 'high' | 'medium' | 'low'
export type Gender = 'male' | 'female'

export const CustomerTypes: CustomerType[] = ['individual', 'business']
export const CustomerStatuses: CustomerStatus[] = ['prospect', 'active', 'inactive']
export const CustomerPotentials: CustomerPotential[] = ['high', 'medium', 'low']

export interface Customer {
  id: string
  companyId: string
  name: string
  type: CustomerType
  categoryId: string | null
  segmentationId: string | null
  areaId: string | null
  status: CustomerStatus
  potential: CustomerPotential
  hasContractHistory: boolean
  lastRevenue: string | null
  lastContractYear: number | null
  primaryContactId: string | null
  gender: Gender | null
  address: string | null
  birthPlace: string | null
  dateOfBirth: string | null
  religion: string | null
  education: string | null
  email: string | null
  spouseName: string | null
  spouseOccupation: string | null
  childrenNames: string | null
  childrenOccupation: string | null
  character: string | null
  hobby: string | null
  companyName: string | null
  position: string | null
  companyAddress: string | null
  whatsapp: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CreateCustomerReq {
  company_id: string
  name: string
  type: CustomerType
  categoryId?: string
  segmentationId?: string
  areaId?: string
  status?: CustomerStatus
  potential?: CustomerPotential
  hasContractHistory?: boolean
  lastRevenue?: number
  lastContractYear?: number
  gender?: Gender
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
  id: string
  company_id: string
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
  primaryContactId?: string
  gender?: Gender
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
  company_id: string
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
