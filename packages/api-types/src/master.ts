import type { PaginationMetadata, PaginationQuery } from './common'

export interface MasterItem {
  id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMasterItemReq {
  name: string
}

export interface UpdateMasterItemReq {
  name?: string
  isActive?: boolean
}

export interface GetMasterItemReq {
  q?: string
  isActive?: boolean
  pagination?: PaginationQuery
}

export interface MasterItemList {
  items: MasterItem[]
  pagination: PaginationMetadata
}

// aliases for clarity at call sites
export type CustomerCategory = MasterItem
export type Segmentation = MasterItem
export type Area = MasterItem
export type RelationStatus = MasterItem
