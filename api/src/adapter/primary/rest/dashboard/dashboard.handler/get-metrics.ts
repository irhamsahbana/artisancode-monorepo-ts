import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IDashboardUsecase } from '@/contracts/dashboard.contract'

export function getDashboardMetricsHandler(usecase: IDashboardUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.getMetrics({})
    return c.json(responseSuccess(data))
  }
}
