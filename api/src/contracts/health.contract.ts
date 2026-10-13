import type { AppEnv } from '@artisancode/types'
import type { Context } from 'hono'

export interface HealthCheckResult {
  status: string
  latency: number
}

export interface IHealthRepo {
  checkDb(): Promise<HealthCheckResult>
  checkCache(): Promise<HealthCheckResult>
}

export interface IHealthUsecase {
  check(): Promise<{
    db: HealthCheckResult
    cache: HealthCheckResult
  }>
}

export interface IHealthHandler {
  check(c: Context<AppEnv>): Promise<Response>
}
