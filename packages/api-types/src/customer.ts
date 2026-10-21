import type { PaginationMetadata, PaginationQuery } from './common'

export type CustomerStatus = 'prospect' | 'active' | 'inactive'
export type CustomerPotential = 'high' | 'medium' | 'low'
// BUMN / swasta nasional / swasta asing (client taxonomy) — replaces the
// generic UMKM/Korporat/Enterprise segmentation master values.
export type CompanyType = 'bumn' | 'swasta_nasional' | 'swasta_asing' | 'perorangan'

export interface Customer {
  id: string
  name: string
  segmentationId: string
  areaId: string
  companyType?: CompanyType
  status: CustomerStatus
  potential: CustomerPotential
  address?: string
  npwp?: string
  skt?: string
  companyEmail?: string
  phone?: string
  fax?: string
  phoneCountryCode?: string
  faxCountryCode?: string
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
  phone?: string
  fax?: string
  phoneCountryCode?: string
  faxCountryCode?: string
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
  phone?: string
  fax?: string
  phoneCountryCode?: string
  faxCountryCode?: string
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

export interface CustomerImportRow {
  rowNumber: number
  name: string
  categoryName?: string
  categoryId?: string
  segmentationName?: string
  segmentationId?: string
  areaName?: string
  areaId?: string
  companyType?: CompanyType
  status?: CustomerStatus
  potential?: CustomerPotential
  address?: string
  companyEmail?: string
  phone?: string
  fax?: string
  phoneCountryCode?: string
  faxCountryCode?: string
  website?: string
  npwp?: string
  skt?: string
  hasContractHistory?: boolean
  lastContractYear?: number
  lastRevenue?: number
  notes?: string
}

export interface KeyPersonImportRow {
  rowNumber: number
  customerName: string
  name: string
  position?: string
  whatsapp?: string
  landline?: string
  landlineCountryCode?: string
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
  profiling?: string
  notes?: string
  isPrimary?: boolean
}

export interface ImportError {
  sheet: 'Customer' | 'Key Person'
  row: number
  field?: string
  value?: string
  message: string
}

export interface CustomerImportDryRunResult {
  totalCustomers: number
  validCustomers: number
  totalKeyPersons: number
  validKeyPersons: number
  errors: ImportError[]
  previewCustomers: CustomerImportRow[]
  previewKeyPersons: KeyPersonImportRow[]
}

export interface CustomerImportExecuteResult {
  createdCustomers: number
  updatedCustomers: number
  createdKeyPersons: number
  skippedCustomers: number
  errors: ImportError[]
}

