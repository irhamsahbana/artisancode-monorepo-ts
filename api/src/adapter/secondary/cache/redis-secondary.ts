import KeyvRedis from '@keyv/redis'

import { env } from '@/config/env'

// ponytail: Cacheable writes its `namespace` option directly onto the
// secondary store instance, so a shared KeyvRedis object would have the last
// constructed cache's namespace leak onto every other cache's keys. Each
// cache gets its own KeyvRedis wrapper (independent .namespace) built on top
// of one shared underlying connection.
const client = env.REDIS_URL ? new KeyvRedis(env.REDIS_URL).client : undefined

export const createRedisSecondary = () => (client ? new KeyvRedis(client) : undefined)
