import { PaginationMetadata, PaginationQuery } from './pagination.entity'
import { BaseEntity } from './timestamp.entity'

export type UserStatus = 'active' | 'inactive'

export const UserStatuses: UserStatus[] = ['active', 'inactive']

export interface CreateUserReq {
  name: string
  username: string
  email: string
  password: string
  phone: string
  role_id: string
  status?: UserStatus
}

export interface LoginReq {
  email: string
  password: string
}

export interface UpdateAccountReq {
  id: string
  name?: string
  email?: string
  current_password?: string
  new_password?: string
}

export interface UpdateUserReq {
  id: string
  name?: string
  email?: string
  phone?: string
  role_id?: string
  status?: UserStatus
}

export interface GetUserReq {
  id?: string
  username?: string
  pagination?: PaginationQuery
}

export interface User extends BaseEntity {
  id: string
  roleId: string
  name: string
  username: string
  email: string
  phone: string
  status: UserStatus
  isProtected: boolean
}

export interface UserList {
  items: User[]
  pagination: PaginationMetadata
}

export interface LoginRes extends User {
  token: string
  permissions: string[]
}

export interface RegisterReq {
  company_name: string
  name: string
  username: string
  email: string
  password: string
  phone: string
}

export interface RegisterRes {
  company: {
    id: string
    name: string
  }
  user: {
    id: string
    username: string
    email: string
  }
}
