import { IDashboardRepo, IDashboardUsecase } from '@/contracts/dashboard.contract'

import { getDashboardMetrics } from './dashboard.usecase/get-metrics'

export interface DashboardUsecaseDeps {
  repo: IDashboardRepo
}

export function createDashboardUsecase(repo: IDashboardRepo): IDashboardUsecase {
  const deps: DashboardUsecaseDeps = { repo }

  return {
    getMetrics: (req) => getDashboardMetrics(deps, req),
  }
}

export default createDashboardUsecase
