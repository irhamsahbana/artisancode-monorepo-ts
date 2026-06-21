import { PaginationMetadata, PaginationQuery } from './pagination.entity'

export type MasterItemType = 'customer_category' | 'segmentation' | 'area' | 'relation_status'

export const MasterItemTypes: MasterItemType[] = [
  'customer_category',
  'segmentation',
  'area',
  'relation_status',
]

// URL slug → DB type mapping
export const masterTypeSlugMap: Record<string, MasterItemType> = {
  'customer-categories': 'customer_category',
  segmentations: 'segmentation',
  areas: 'area',
  'relation-statuses': 'relation_status',
}

export interface MasterItem {
  id: string
  companyId: string
  type: MasterItemType
  name: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CreateMasterItemReq {
  company_id: string
  type: MasterItemType
  name: string
}

export interface UpdateMasterItemReq {
  id: string
  company_id: string
  name?: string
  isActive?: boolean
}

export interface GetMasterItemReq {
  company_id: string
  type: MasterItemType
  q?: string
  isActive?: boolean
  pagination?: PaginationQuery
}

export interface MasterItemList {
  items: MasterItem[]
  pagination: PaginationMetadata
}
