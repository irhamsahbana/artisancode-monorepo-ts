import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUomUsecase } from '@/contracts/uom.contract'
import * as Entity from '@/entities/uom.entity'

import { createUomHandler } from '../uom.handler'

describe('UomHandler - findUomList', () => {
  const mockUom: Entity.UnitOfMeasurement = {
    id: 'uom-1',
    name: 'Meter Kubik',
    symbol: 'm3',
    category: 'volume',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    findUomList: mock(async () => ({
      items: [mockUom],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
  } as unknown as IUomUsecase

  const handler = createUomHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', handler.findUomList)

  it('should return 200 with uom list', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.items.length).toBe(1)
    expect(mockUsecase.findUomList).toHaveBeenCalled()
  })
})
