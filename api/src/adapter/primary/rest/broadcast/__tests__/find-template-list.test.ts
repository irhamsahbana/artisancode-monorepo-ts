import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBroadcastUsecase } from '@/contracts/broadcast.contract'
import * as Entity from '@/entities/broadcast.entity'

import { createBroadcastHandler } from '../broadcast.handler'

describe('BroadcastHandler - findTemplateList', () => {
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
    findTemplateList: mock(async () => ({
      items: [mockTemplate],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
  } as unknown as IBroadcastUsecase

  const handler = createBroadcastHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', (c) => handler.findTemplateList(c))

  it('should return 200 with broadcast templates', async () => {
    const res = await app.request('/?page=1&per_page=10')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.items).toHaveLength(1)
    expect(json.data.items[0].id).toBe('bt-1')
    expect(mockUsecase.findTemplateList).toHaveBeenCalledWith(1, 10)
  })
})
