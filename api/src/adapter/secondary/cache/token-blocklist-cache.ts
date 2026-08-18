import { Cacheable } from 'cacheable'

import { hashToken } from '@/adapter/secondary/cache/hash-token'
import { createRedisSecondary } from '@/adapter/secondary/cache/redis-secondary'

const cache = new Cacheable({ secondary: createRedisSecondary(), namespace: 'token-blocklist' })

const GRACE_MS = 60_000

export const blockToken = (token: string, exp: number) => {
  const ttl = exp * 1000 - Date.now() + GRACE_MS
  if (ttl <= 0) return
  return cache.set(hashToken(token), true, ttl)
}

export const isTokenBlocked = (token: string) => cache.get<boolean>(hashToken(token))
