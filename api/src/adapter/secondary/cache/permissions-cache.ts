import { Cacheable } from 'cacheable'

import { createRedisSecondary } from '@/adapter/secondary/cache/redis-secondary'

const cache = new Cacheable({
  ttl: '5m',
  secondary: createRedisSecondary(),
  namespace: 'permissions',
})

export const getCachedPermissions = (roleId: string) => cache.get<string[]>(roleId)
export const setCachedPermissions = (roleId: string, names: string[]) => cache.set(roleId, names)
