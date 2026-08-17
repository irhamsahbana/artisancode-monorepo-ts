import type { Permission } from './role'

export interface User {
  id: string
  name: string
  email: string
  permissions: Permission[]
}

export interface LoginReq {
  email: string
  password: string
}

export interface LoginRes {
  user: User
  token: string
  refreshToken: string
}

export interface UpdateAccountReq {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}
