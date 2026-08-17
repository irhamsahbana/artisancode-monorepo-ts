import { Cacheable } from 'cacheable'

// ponytail: in-memory cache, per-process. Fine for a single-instance API;
// switch to a shared secondary store (Redis) if this ever runs multi-instance.
const cache = new Cacheable()

const GRACE_MS = 60_000

export const blockToken = (token: string, exp: number) => {
  const ttl = exp * 1000 - Date.now() + GRACE_MS
  if (ttl <= 0) return
  return cache.set(token, true, ttl)
}

export const isTokenBlocked = (token: string) => cache.get<boolean>(token)
