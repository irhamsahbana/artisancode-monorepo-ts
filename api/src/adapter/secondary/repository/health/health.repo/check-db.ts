import { withSpan } from '@artisancode/observability'

import logger from '@/config/logger'
import { HealthCheckResult } from '@/contracts/health.contract'

export async function checkDb(): Promise<HealthCheckResult> {
  return withSpan('HealthRepo.checkDb', async () => {
    logger.info('[health.repo] checking database connectivity')
    // simulasikan query ke database
    await new Promise((r) => setTimeout(r, 5))
    logger.info('[health.repo] database respond')
    return { status: 'ok', latency: 5 }
  })
}
