import { withSpan } from '@artisancode/observability'

import { IHealthRepo, IHealthUsecase } from '@/contracts/health.contract'

import { checkHealth } from './health.usecase/check'

export interface HealthUsecaseDeps {
  repo: IHealthRepo
}

export function createHealthUsecase(repo: IHealthRepo): IHealthUsecase {
  const deps: HealthUsecaseDeps = { repo }

  return {
    check: () => withSpan('HealthUsecase.check', () => checkHealth(deps)),
  }
}

export default class HealthUsecase implements IHealthUsecase {
  private readonly deps: HealthUsecaseDeps

  constructor(repo: IHealthRepo) {
    this.deps = { repo }
  }

  async check() {
    return withSpan('HealthUsecase.check', () => checkHealth(this.deps))
  }
}
