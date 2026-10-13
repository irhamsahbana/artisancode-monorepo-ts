import { withSpan } from '@artisancode/observability'

import type { IHealthHandler, IHealthUsecase } from '@/contracts/health.contract'

import { checkHealthHandler } from './check'

export function createHealthHandlerDeps(usecase: IHealthUsecase): IHealthHandler {
  const handler = checkHealthHandler(usecase)

  return {
    check: (c) => withSpan('HealthHandler.check', () => handler(c)),
  }
}

export { createHealthHandlerDeps as createHealthHandler }
export default createHealthHandlerDeps
