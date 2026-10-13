import { IDashboardRepo } from '@/contracts/dashboard.contract'

import { getDashboardMetrics } from './dashboard.repo/get-metrics'

export function createDashboardRepo(): IDashboardRepo {
  return {
    getMetrics: () => getDashboardMetrics(),
  }
}

export default createDashboardRepo
