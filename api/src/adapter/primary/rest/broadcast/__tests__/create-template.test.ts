import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBroadcastUsecase } from '@/contracts/broadcast.contract'
import * as Entity from '@/entities/broadcast.entity'

import { createBroadcastHandler } from '../broadcast.handler'

describe('BroadcastHandler - createTemplate', () => {
  const mockTemplate: Entity.BroadcastTemplate = {
    id: 'bt-1',
    name: 'Promo Beton',
    message: 'Halo {{nama}}, ada diskon!',
    occasion: 'custom',
    audienceGender: null,
    audienceReligion: null,
    audienceSegmentationId: null,
    audienceCustomerStatus: null,
    scheduledAt: null,
    sentAt: null,
    status: 'draft',
    createdAt: new Date(),
  }

  const mockUsecase = {
    createTemplate: mock(async () => mockTemplate),
  } as unknown as IBroadcastUsecase

  const handler = createBroadcastHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', { name: 'Promo Beton', message: 'Halo {{nama}}, ada diskon!' } as any)
    return handler.createTemplate(c)
  })

  it('should return 201 with created broadcast template', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('bt-1')
    expect(json.data.name).toBe('Promo Beton')
    expect(mockUsecase.createTemplate).toHaveBeenCalled()
  })
})
