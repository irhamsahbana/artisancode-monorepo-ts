import { Cacheable } from 'cacheable'

import { redisSecondary } from '@/adapter/secondary/cache/redis-secondary'

const cache = new Cacheable({ ttl: '5m', secondary: redisSecondary })

export const getCachedPermissions = (roleId: string) => cache.get<string[]>(roleId)
export const setCachedPermissions = (roleId: string, names: string[]) => cache.set(roleId, names)
