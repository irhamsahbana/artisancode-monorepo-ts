import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import logger from '@/config/logger'
import type { IHealthUsecase } from '@/contracts/health.contract'

export function checkHealthHandler(usecase: IHealthUsecase) {
  return async (c: Context<AppEnv>) => {
    logger.info('[health.handler] request received')
    logger.info('[health.handler] calling usecase')
    const result = await usecase.check()
    logger.info('[health.handler] sending response')

    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      checks: result,
    })
  }
}
