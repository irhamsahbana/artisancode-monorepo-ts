import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import type { IHealthUsecase } from '@/contracts/health.contract'

import { createHealthHandler } from '../health.handler'

describe('HealthHandler - check', () => {
  const mockUsecase = {
    check: mock(async () => ({
      db: { status: 'ok', latency: 5 },
      cache: { status: 'ok', latency: 2 },
    })),
  } as unknown as IHealthUsecase

  const handler = createHealthHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', (c) => handler.check(c))

  it('should return 200 with health status ok', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.status).toBe('ok')
    expect(json.checks.db.status).toBe('ok')
    expect(json.checks.cache.status).toBe('ok')
    expect(mockUsecase.check).toHaveBeenCalled()
  })
})
