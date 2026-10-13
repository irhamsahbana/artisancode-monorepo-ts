import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { ICategoryUsecase } from '@/contracts/category.contract'

import { createCategoryHandler } from '../category.handler'

describe('CategoryHandler - delete', () => {
  const mockUsecase: ICategoryUsecase = {
    create: mock(async () => ({}) as any),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
    findById: mock(async () => ({}) as any),
    findList: mock(async () => ({
      items: [],
      pagination: { total: 0, page: 1, per_page: 10, last_page: 1 },
    })),
  }

  const handler = createCategoryHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.delete('/:id', handler.delete)

  it('should return 200 after deleting category', async () => {
    const res = await app.request('/cat-1', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.delete).toHaveBeenCalledWith('cat-1')
  })
})
