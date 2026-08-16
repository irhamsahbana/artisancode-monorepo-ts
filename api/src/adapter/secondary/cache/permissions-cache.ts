import { Cacheable } from 'cacheable'

// ponytail: in-memory cache, per-process. Fine for a single-instance API;
// switch to a shared secondary store (Redis) if this ever runs multi-instance.
const cache = new Cacheable({ ttl: '5m' })

export const getCachedPermissions = (roleId: string) => cache.get<string[]>(roleId)
export const setCachedPermissions = (roleId: string, names: string[]) => cache.set(roleId, names)
