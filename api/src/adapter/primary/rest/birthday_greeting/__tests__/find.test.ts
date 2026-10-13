import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBirthdayGreetingUsecase } from '@/contracts/birthday_greeting.contract'
import * as Entity from '@/entities/birthday_greeting.entity'

import { createBirthdayGreetingHandler } from '../birthday_greeting.handler'

describe('BirthdayGreetingHandler - find', () => {
  const mockSettings: Entity.BirthdayGreetingSettings = {
    id: 'bg-1',
    message: 'Selamat Ulang Tahun {{nama}}!',
    enabled: true,
    audienceGender: null,
    audienceReligion: null,
    audienceSegmentationId: null,
    audienceCustomerStatus: null,
    updatedAt: new Date(),
  }

  const mockUsecase = {
    find: mock(async () => mockSettings),
  } as unknown as IBirthdayGreetingUsecase

  const handler = createBirthdayGreetingHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', (c) => handler.find(c))

  it('should return 200 with birthday greeting settings', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('bg-1')
    expect(json.data.enabled).toBe(true)
    expect(mockUsecase.find).toHaveBeenCalled()
  })
})
