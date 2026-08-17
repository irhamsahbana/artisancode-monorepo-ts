import type { PaginationMetadata } from './common'

export type UserAccountStatus = 'active' | 'inactive'

export interface UserAccount {
  id: string
  roleId: string
  name: string
  username: string
  email: string
  phone: string
  status: UserAccountStatus
  createdAt: string
  updatedAt: string
}

export interface CreateUserAccountReq {
  name: string
  username: string
  email: string
  password: string
  phone: string
  role_id: string
}

export interface GetUserAccountReq {
  q?: string
}

export interface UserAccountList {
  items: UserAccount[]
  pagination: PaginationMetadata
}
