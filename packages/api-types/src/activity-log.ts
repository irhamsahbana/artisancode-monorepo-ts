import type { PaginationMetadata, PaginationQuery } from './common'

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  entityName: string
  entityId: string
  activity: string
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  createdAt: string
}

export interface GetActivityLogReq {
  userId?: string
  entityName?: string
  entityId?: string
  q?: string
  pagination?: PaginationQuery
}

export interface ActivityLogList {
  items: ActivityLog[]
  pagination: PaginationMetadata
}
