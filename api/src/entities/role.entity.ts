import { PaginationMetadata, PaginationQuery } from './pagination.entity'
import { BaseEntity, Timestamp } from './timestamp.entity'

export interface CreateRoleReq {
  name: string
  description?: string
  permissions?: string[]
}

export interface UpdateRoleReq {
  id: string
  name?: string
  description?: string
  permissions?: string[]
}

export interface GetRoleReq {
  id?: string
  ids?: string[]
  q?: string
  pagination?: PaginationQuery
}

export interface Permission extends Timestamp {
  id: string
  name: string
  description: string
}

export interface Role extends BaseEntity {
  id: string
  name: string
  description: string
  isSystem: boolean
  /** Permission names, e.g. ["customers.view", "projects.create"] */
  permissions?: string[]
}

export interface RoleList {
  items: Role[]
  pagination: PaginationMetadata
}

export interface CreatePermissionReq {
  name: string
  description?: string
}

export interface GetPermissionReq {
  id?: string
  q?: string
  pagination?: PaginationQuery
}

export interface PermissionList {
  items: Permission[]
  pagination: PaginationMetadata
}
