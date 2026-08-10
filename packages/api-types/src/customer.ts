import type { PaginationMetadata, PaginationQuery } from './common'

export type CustomerStatus = 'prospect' | 'active' | 'inactive'
export type CustomerPotential = 'high' | 'medium' | 'low'
// BUMN / swasta nasional / swasta asing (client taxonomy) — replaces the
// generic UMKM/Korporat/Enterprise segmentation master values.
export type CompanyType = 'bumn' | 'swasta_nasional' | 'swasta_asing'

// Company-level data only. Personal data (gender, birth date, hobby, family,
// profiling) lives on Contact (the key person), not here.
export interface Customer {
  id: string
  name: string
  segmentationId: string
  areaId: string
  companyType?: CompanyType
  status: CustomerStatus
  potential: CustomerPotential
  primaryContactId?: string
  address?: string
  npwp?: string
  skt?: string
  companyEmail?: string
  website?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerReq {
  name: string
  segmentationId: string
  areaId: string
  companyType?: CompanyType
  status?: CustomerStatus
  potential?: CustomerPotential
  address?: string
  npwp?: string
  skt?: string
  companyEmail?: string
  website?: string
  notes?: string
}

export interface UpdateCustomerReq {
  name?: string
  segmentationId?: string
  areaId?: string
  companyType?: CompanyType
  status?: CustomerStatus
  potential?: CustomerPotential
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
  segmentationId?: string
  areaId?: string
  pagination?: PaginationQuery
}

export interface CustomerList {
  items: Customer[]
  pagination: PaginationMetadata
}
