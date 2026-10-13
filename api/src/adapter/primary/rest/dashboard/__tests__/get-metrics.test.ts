import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IDashboardUsecase } from '@/contracts/dashboard.contract'
import * as Entity from '@/entities/dashboard.entity'

import { createDashboardHandler } from '../dashboard.handler'

describe('DashboardHandler - getMetrics', () => {
  const mockMetrics: Entity.DashboardMetrics = {
    totalCustomers: 100,
    totalProspects: 30,
    totalActive: 60,
    totalInactive: 10,
    withContractHistory: 45,
    highPotential: 25,
    byStatus: [
      { status: 'active', count: 60 },
      { status: 'prospect', count: 30 },
      { status: 'inactive', count: 10 },
    ],
    byCategory: [{ categoryId: 'cat-1', name: 'BUMN', count: 40 }],
    byArea: [{ areaId: 'area-1', name: 'Jawa Barat', count: 50 }],
    byPotential: [
      { potential: 'high', count: 25 },
      { potential: 'medium', count: 50 },
      { potential: 'low', count: 25 },
    ],
  }

  const mockUsecase = {
    getMetrics: mock(async () => mockMetrics),
  } as unknown as IDashboardUsecase

  const handler = createDashboardHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', (c) => handler.getMetrics(c))

  it('should return 200 with dashboard metrics', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.total_customers).toBe(100)
    expect(json.data.total_active).toBe(60)
    expect(mockUsecase.getMetrics).toHaveBeenCalled()
  })
})
