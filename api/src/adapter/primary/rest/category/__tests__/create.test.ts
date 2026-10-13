import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { ICategoryUsecase } from '@/contracts/category.contract'
import * as Entity from '@/entities/category.entity'

import { createCategoryHandler } from '../category.handler'

describe('CategoryHandler - create', () => {
  const mockCategory: Entity.Category = {
    id: 'cat-1',
    parent_id: null,
    name: 'Beton',
    group: 'Product',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  }

  const mockUsecase: ICategoryUsecase = {
    create: mock(async () => mockCategory),
    update: mock(async () => mockCategory),
    delete: mock(async () => {}),
    findById: mock(async () => mockCategory),
    findList: mock(async () => ({
      items: [mockCategory],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
  }

  const handler = createCategoryHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', { name: 'Beton', group: 'Product' } as any)
    return handler.create(c)
  })

  it('should return 201 with created category', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('cat-1')
    expect(mockUsecase.create).toHaveBeenCalled()
  })
})
