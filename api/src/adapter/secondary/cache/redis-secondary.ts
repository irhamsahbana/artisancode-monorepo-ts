import KeyvRedis from '@keyv/redis'

import { env } from '@/config/env'

// ponytail: shared secondary store for all Cacheable() instances. Falls back
// to per-process in-memory only (primary store) when REDIS_URL is unset.
export const redisSecondary = env.REDIS_URL ? new KeyvRedis(env.REDIS_URL) : undefined
