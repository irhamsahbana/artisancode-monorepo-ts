import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IUomUsecase } from '@/contracts/uom.contract'
import * as Entity from '@/entities/uom.entity'

import { createUomHandler } from '../uom.handler'

describe('UomHandler - createUom', () => {
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
    createUom: mock(async () => mockUom),
    findUomList: mock(async () => ({
      items: [mockUom],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
    updateUom: mock(async () => mockUom),
    deleteUom: mock(async () => {}),
    createConversion: mock(async () => ({}) as any),
    findConversionList: mock(async () => ({
      items: [],
      pagination: { total: 0, page: 1, per_page: 10, last_page: 1 },
    })),
    updateConversion: mock(async () => ({}) as any),
    deleteConversion: mock(async () => {}),
  } as unknown as IUomUsecase

  const handler = createUomHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', { name: 'Meter Kubik', symbol: 'm3', category: 'volume' } as any)
    return handler.createUom(c)
  })

  it('should return 201 with created uom', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('uom-1')
    expect(mockUsecase.createUom).toHaveBeenCalled()
  })
})
