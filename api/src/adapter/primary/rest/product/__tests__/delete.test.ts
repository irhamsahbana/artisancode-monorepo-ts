import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProductUsecase } from '@/contracts/product.contract'

import { createProductHandler } from '../product.handler'

describe('ProductHandler - delete', () => {
  const mockUsecase: IProductUsecase = {
    create: mock(async () => ({}) as any),
    findList: mock(async () => ({
      items: [],
      pagination: { total: 0, page: 1, per_page: 10, last_page: 1 },
    })),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
  }

  const handler = createProductHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.delete('/:id', handler.delete)

  it('should return 200 after deleting product', async () => {
    const res = await app.request('/prod-1', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.delete).toHaveBeenCalledWith('prod-1')
  })
})
