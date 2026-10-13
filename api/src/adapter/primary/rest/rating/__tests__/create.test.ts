import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IRatingUsecase } from '@/contracts/rating.contract'
import * as Entity from '@/entities/rating.entity'

import { createRatingHandler } from '../rating.handler'

describe('RatingHandler - create', () => {
  const mockRating: Entity.CustomerRating = {
    id: 'rat-1',
    customerId: 'cust-1',
    contactId: null,
    ratingDate: '2026-10-13',
    paymentScore: 90,
    relationshipScore: 85,
    problemNotes: null,
    riskLevel: 'low',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    create: mock(async () => mockRating),
    findList: mock(async () => ({
      items: [mockRating],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
  } as unknown as IRatingUsecase

  const handler = createRatingHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', {
      customerId: 'cust-1',
      ratingDate: '2026-10-13',
      paymentScore: 90,
      relationshipScore: 85,
    } as any)
    return handler.create(c)
  })

  it('should return 201 with created rating', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('rat-1')
    expect(mockUsecase.create).toHaveBeenCalled()
  })
})
