import { withSpan } from '@artisancode/observability'

import logger from '@/config/logger'
import { HealthCheckResult } from '@/contracts/health.contract'

import type { HealthUsecaseDeps } from '../health.usecase'

export async function checkHealth(deps: HealthUsecaseDeps): Promise<{
  db: HealthCheckResult
  cache: HealthCheckResult
}> {
  logger.info('[health.usecase] starting health check')

  const db = await withSpan('HealthUsecase.checkDb', async () => {
    logger.info('[health.usecase] delegating to repo for db check')
    return deps.repo.checkDb()
  })

  const cache = await withSpan('HealthUsecase.checkCache', async () => {
    logger.info('[health.usecase] delegating to repo for cache check')
    return deps.repo.checkCache()
  })

  logger.info('[health.usecase] all checks completed')
  return { db, cache }
}
