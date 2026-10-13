import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUomUsecase } from '@/contracts/uom.contract'
import * as Entity from '@/entities/uom.entity'

import { createUomHandler } from '../uom.handler'

describe('UomHandler - createConversion', () => {
  const mockConversion: Entity.UnitConversion = {
    id: 'conv-1',
    fromUnitId: 'uom-1',
    toUnitId: 'uom-2',
    factor: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    createConversion: mock(async () => mockConversion),
  } as unknown as IUomUsecase

  const handler = createUomHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/conversions', (c) => {
    c.set('body', { from_unit_id: 'uom-1', to_unit_id: 'uom-2', factor: 1000 } as any)
    return handler.createConversion(c)
  })

  it('should return 201 with created conversion', async () => {
    const res = await app.request('/conversions', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('conv-1')
    expect(mockUsecase.createConversion).toHaveBeenCalled()
  })
})
