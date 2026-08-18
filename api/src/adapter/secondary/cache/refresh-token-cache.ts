import { Cacheable } from 'cacheable'

import { hashToken } from '@/adapter/secondary/cache/hash-token'
import { redisSecondary } from '@/adapter/secondary/cache/redis-secondary'
import { env } from '@/config/env'

// ponytail: TTL mirrors refresh token expiry so entries self-expire.
const cache = new Cacheable({
  ttl: env.JWT.REFRESH_EXPIRES_IN,
  secondary: redisSecondary,
  namespace: 'refresh-token',
})

export const getCachedRefreshTokenUserId = (token: string) => cache.get<string>(hashToken(token))
export const setCachedRefreshToken = (token: string, userId: string) =>
  cache.set(hashToken(token), userId)
export const deleteCachedRefreshToken = (token: string) => cache.delete(hashToken(token))
