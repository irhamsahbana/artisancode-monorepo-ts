import { withSpan } from '@artisancode/observability'

import logger from '@/config/logger'
import { HealthCheckResult } from '@/contracts/health.contract'

export async function checkCache(): Promise<HealthCheckResult> {
  return withSpan('HealthRepo.checkCache', async () => {
    logger.info('[health.repo] checking cache connectivity')
    // simulasikan query ke cache
    await new Promise((r) => setTimeout(r, 2))
    logger.info('[health.repo] cache respond')
    return { status: 'ok', latency: 2 }
  })
}
