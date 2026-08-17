import { Cacheable } from 'cacheable'

import { env } from '@/config/env'

// ponytail: in-memory cache, per-process, TTL mirrors refresh token expiry so
// entries self-expire. Same tradeoff as permissions-cache.ts — move to a
// shared store (Redis) if this ever runs multi-instance.
const cache = new Cacheable({ ttl: env.JWT.REFRESH_EXPIRES_IN })

export const getCachedRefreshTokenUserId = (token: string) => cache.get<string>(token)
export const setCachedRefreshToken = (token: string, userId: string) => cache.set(token, userId)
export const deleteCachedRefreshToken = (token: string) => cache.delete(token)
