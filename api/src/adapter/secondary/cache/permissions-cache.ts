import { Cacheable } from 'cacheable'

import { createPostgresSecondary } from '@/adapter/secondary/cache/postgres-secondary'

const cache = new Cacheable({
  ttl: '5m',
  secondary: createPostgresSecondary(),
  namespace: 'permissions',
})

export const getCachedPermissions = (roleId: string) => cache.get<string[]>(roleId)
export const setCachedPermissions = (roleId: string, names: string[]) => cache.set(roleId, names)
