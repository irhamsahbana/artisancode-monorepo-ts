import {
  getCachedDashboardMetrics,
  setCachedDashboardMetrics,
} from '@/adapter/secondary/cache/dashboard-cache'
import * as Entity from '@/entities/dashboard.entity'

import type { DashboardUsecaseDeps } from '../dashboard.usecase'

export async function getDashboardMetrics(
  deps: DashboardUsecaseDeps,
  req: Record<never, never>,
): Promise<Entity.DashboardMetrics> {
  const cached = await getCachedDashboardMetrics()
  if (cached) return cached

  const metrics = await deps.repo.getMetrics(req)
  await setCachedDashboardMetrics(metrics)
  return metrics
}
