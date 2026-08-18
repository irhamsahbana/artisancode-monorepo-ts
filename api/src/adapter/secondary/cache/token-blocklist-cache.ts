import { Cacheable } from 'cacheable'

import { redisSecondary } from '@/adapter/secondary/cache/redis-secondary'

const cache = new Cacheable({ secondary: redisSecondary })

const GRACE_MS = 60_000

export const blockToken = (token: string, exp: number) => {
  const ttl = exp * 1000 - Date.now() + GRACE_MS
  if (ttl <= 0) return
  return cache.set(token, true, ttl)
}

export const isTokenBlocked = (token: string) => cache.get<boolean>(token)
