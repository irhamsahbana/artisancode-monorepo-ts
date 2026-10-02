import { Cacheable } from 'cacheable'

import { createRedisSecondary } from '@/adapter/secondary/cache/redis-secondary'

const cache = new Cacheable({ secondary: createRedisSecondary(), namespace: 'rate-limit' })

interface Bucket {
  count: number
  resetAt: number
}

// ponytail: get-then-set isn't atomic, so two requests landing in the same
// millisecond could both read the same count and under-count by one — fine
// for abuse throttling, not a billing-grade quota. Swap for a Redis Lua
// INCR+PEXPIRE script if exact counts ever matter.
export async function hitRateLimit(
  key: string,
  windowMs: number,
): Promise<{ count: number; retryAfterMs: number }> {
  const now = Date.now()
  const existing = await cache.get<Bucket>(key)

  if (!existing || existing.resetAt <= now) {
    await cache.set(key, { count: 1, resetAt: now + windowMs } satisfies Bucket, windowMs)
    return { count: 1, retryAfterMs: windowMs }
  }

  const retryAfterMs = existing.resetAt - now
  const next: Bucket = { count: existing.count + 1, resetAt: existing.resetAt }
  await cache.set(key, next, retryAfterMs)
  return { count: next.count, retryAfterMs }
}
