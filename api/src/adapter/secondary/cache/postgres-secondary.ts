import KeyvPostgres from '@keyv/postgres'

import { env } from '@/config/env'

// Dedicated schema keeps cache tables separated from app tables.
const CACHE_SCHEMA = 'cache'

// ponytail: Cacheable writes its `namespace` option directly onto the
// secondary store instance, so a shared KeyvPostgres object would have the
// last constructed cache's namespace leak onto every other cache's keys.
// Each cache gets its own KeyvPostgres instance (independent .namespace),
// all pointed at the same dedicated schema/table.
export const createPostgresSecondary = () =>
  new KeyvPostgres({ uri: env.DATABASE.URL, schema: CACHE_SCHEMA, table: 'cache' })
