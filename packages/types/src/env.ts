export interface JwtPayload {
  id: string
  role_id: string
  name: string
  username: string
  permissions?: string[]
}

export interface AppEnv {
  Variables: {
    user?: JwtPayload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any
    rawBody?: string
    traceId?: string
  }
}
