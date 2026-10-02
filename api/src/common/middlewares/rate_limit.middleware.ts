import { AppEnv, ErrorCode } from '@artisancode/types'
import { Context, Next } from 'hono'

import { hitRateLimit } from '@/adapter/secondary/cache/rate-limit-cache'
import { responseError } from '@/common/rest_response'

interface RateLimitOptions {
  /** Window size in milliseconds. */
  windowMs: number
  /** Max requests allowed per key within the window. */
  max: number
  /** Namespaces the counter so different routes don't share a bucket. */
  keyPrefix: string
}

function clientIp(c: Context): string {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || 'unknown'
  )
}

export function rateLimit({ windowMs, max, keyPrefix }: RateLimitOptions) {
  return async (c: Context<AppEnv>, next: Next) => {
    const { count, retryAfterMs } = await hitRateLimit(`${keyPrefix}:${clientIp(c)}`, windowMs)

    if (count > max) {
      c.header('Retry-After', String(Math.ceil(retryAfterMs / 1000)))
      return c.json(
        responseError(
          'Terlalu banyak percobaan, coba lagi nanti.',
          undefined,
          ErrorCode.TOO_MANY_REQUESTS,
        ),
        429,
      )
    }

    await next()
  }
}
