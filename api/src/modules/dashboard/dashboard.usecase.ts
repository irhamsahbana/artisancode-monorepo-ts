import {
  getCachedDashboardMetrics,
  setCachedDashboardMetrics,
} from '@/adapter/secondary/cache/dashboard-cache'
import { IDashboardRepo, IDashboardUsecase } from '@/contracts/dashboard.contract'

export function createDashboardUsecase(repo: IDashboardRepo): IDashboardUsecase {
  return {
    getMetrics: async (req) => {
      const cached = await getCachedDashboardMetrics()
      if (cached) return cached

      const metrics = await repo.getMetrics(req)
      await setCachedDashboardMetrics(metrics)
      return metrics
    },
  }
}
