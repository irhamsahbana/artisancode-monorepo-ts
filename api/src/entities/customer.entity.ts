import { PaginationMetadata, PaginationQuery } from './pagination.entity'

export type CustomerStatus = 'prospect' | 'active' | 'inactive'
export type CustomerPotential = 'high' | 'medium' | 'low'
// BUMN / swasta nasional / swasta asing (client taxonomy)
export type CompanyType = 'bumn' | 'swasta_nasional' | 'swasta_asing'

export const CustomerStatuses: CustomerStatus[] = ['prospect', 'active', 'inactive']
export const CustomerPotentials: CustomerPotential[] = ['high', 'medium', 'low']
export const CompanyTypes: CompanyType[] = ['bumn', 'swasta_nasional', 'swasta_asing']

export interface Customer {
  id: string
  name: string
  categoryId: string | null
  segmentationId: string | null
  areaId: string | null
  status: CustomerStatus
  potential: CustomerPotential
  hasContractHistory: boolean
  lastRevenue: string | null
  lastContractYear: number | null
  primaryContactId: string | null
  companyType: CompanyType | null
  address: string | null
  npwp: string | null
  skt: string | null
  companyEmail: string | null
  website: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CreateCustomerReq {
  name: string
  categoryId?: string
  segmentationId?: string
  areaId?: string
  status?: CustomerStatus
  potential?: CustomerPotential
  hasContractHistory?: boolean
  lastRevenue?: number
  lastContractYear?: number
  companyType?: CompanyType
  address?: string
  npwp?: string
  skt?: string
  companyEmail?: string
  website?: string
  notes?: string
}

export interface UpdateCustomerReq {
  id: string

  name?: string
  categoryId?: string
  segmentationId?: string
  areaId?: string
  status?: CustomerStatus
  potential?: CustomerPotential
  hasContractHistory?: boolean
  lastRevenue?: number
  lastContractYear?: number
  primaryContactId?: string
  companyType?: CompanyType
  address?: string
  npwp?: string
  skt?: string
  companyEmail?: string
  website?: string
  notes?: string
}

export interface GetCustomerReq {
  q?: string
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
