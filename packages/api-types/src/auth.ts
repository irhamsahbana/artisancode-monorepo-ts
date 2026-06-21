export interface User {
  id: string
  name: string
  email: string
}

export interface LoginReq {
  email: string
  password: string
}

export interface LoginRes {
  user: User
  token: string
}

export interface UpdateAccountReq {
  name?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}
