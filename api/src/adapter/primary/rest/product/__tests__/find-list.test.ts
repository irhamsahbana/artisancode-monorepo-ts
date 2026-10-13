import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProductUsecase } from '@/contracts/product.contract'
import * as Entity from '@/entities/product.entity'

import { createProductHandler } from '../product.handler'

describe('ProductHandler - findList', () => {
  const mockProduct: Entity.Product = {
    id: 'prod-1',
    name: 'Beton K-250',
    unit: 'm3',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase: IProductUsecase = {
    create: mock(async () => mockProduct),
    findList: mock(async () => ({
      items: [mockProduct],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
    update: mock(async () => mockProduct),
    delete: mock(async () => {}),
  }

  const handler = createProductHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', handler.findList)

  it('should return 200 with product list', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.items.length).toBe(1)
    expect(mockUsecase.findList).toHaveBeenCalled()
  })
})
