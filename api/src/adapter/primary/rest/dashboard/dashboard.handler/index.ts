import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IDashboardUsecase } from '@/contracts/dashboard.contract'

import { getDashboardMetricsHandler as makeGetMetrics } from './get-metrics'

export function createDashboardHandlerDeps(usecase: IDashboardUsecase) {
  const handlers = {
    getMetrics: makeGetMetrics(usecase),
  }

  return {
    getMetrics: (c: Context<AppEnv>) =>
      withSpan('DashboardHandler.getMetrics', () => handlers.getMetrics(c)),
  }
}

export { createDashboardHandlerDeps as createDashboardHandler }
export default createDashboardHandlerDeps
