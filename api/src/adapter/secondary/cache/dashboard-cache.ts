import { Cacheable } from 'cacheable'

import { createPostgresSecondary } from '@/adapter/secondary/cache/postgres-secondary'
import * as Entity from '@/entities/dashboard.entity'

const METRICS_KEY = 'dashboard-metrics'

// ponytail: short TTL — metrics can lag briefly, but the underlying query is
// 6 aggregate scans over the whole customers table, worth shielding from
// every dashboard load/refresh.
const cache = new Cacheable({
  ttl: '1m',
  secondary: createPostgresSecondary(),
  namespace: 'dashboard',
})

export const getCachedDashboardMetrics = () => cache.get<Entity.DashboardMetrics>(METRICS_KEY)
export const setCachedDashboardMetrics = (metrics: Entity.DashboardMetrics) =>
  cache.set(METRICS_KEY, metrics)
