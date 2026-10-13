import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUomUsecase } from '@/contracts/uom.contract'
import * as Entity from '@/entities/uom.entity'

import { createUomHandler } from '../uom.handler'

describe('UomHandler - findConversionList', () => {
  const mockConversion: Entity.UnitConversion = {
    id: 'conv-1',
    fromUnitId: 'uom-1',
    toUnitId: 'uom-2',
    factor: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    findConversionList: mock(async () => ({
      items: [mockConversion],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
  } as unknown as IUomUsecase

  const handler = createUomHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/conversions', handler.findConversionList)

  it('should return 200 with conversion list', async () => {
    const res = await app.request('/conversions')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.items.length).toBe(1)
    expect(mockUsecase.findConversionList).toHaveBeenCalled()
  })
})
