import jwt from 'jsonwebtoken'

import { env } from '@/config/env'

interface JwtPayload {
  id: string
  role_id: string
  name: string
  username: string
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT.SECRET, {
    expiresIn: env.JWT.EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export const verifyToken = (token: string): unknown => {
  return jwt.verify(token, env.JWT.SECRET)
}

interface RefreshJwtPayload {
  id: string
}

export const generateRefreshToken = (payload: RefreshJwtPayload): string => {
  return jwt.sign(payload, env.JWT.REFRESH_SECRET, {
    expiresIn: env.JWT.REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export const verifyRefreshToken = (token: string): RefreshJwtPayload => {
  return jwt.verify(token, env.JWT.REFRESH_SECRET) as RefreshJwtPayload
}
