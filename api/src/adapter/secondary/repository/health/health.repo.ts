import { IHealthRepo } from '@/contracts/health.contract'

import { checkCache } from './health.repo/check-cache'
import { checkDb } from './health.repo/check-db'

export function createHealthRepo(): IHealthRepo {
  return {
    checkDb,
    checkCache,
  }
}

export default class HealthRepo implements IHealthRepo {
  async checkDb() {
    return checkDb()
  }

  async checkCache() {
    return checkCache()
  }
}
