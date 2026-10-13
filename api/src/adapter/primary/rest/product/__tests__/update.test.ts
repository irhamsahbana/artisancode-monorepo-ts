import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProductUsecase } from '@/contracts/product.contract'
import * as Entity from '@/entities/product.entity'

import { createProductHandler } from '../product.handler'

describe('ProductHandler - update', () => {
  const mockProduct: Entity.Product = {
    id: 'prod-1',
    name: 'Beton K-300',
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
  app.put('/:id', (c) => {
    c.set('body', { name: 'Beton K-300' } as any)
    return handler.update(c)
  })

  it('should return 200 with updated product', async () => {
    const res = await app.request('/prod-1', { method: 'PUT' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Beton K-300')
    expect(mockUsecase.update).toHaveBeenCalled()
  })
})
