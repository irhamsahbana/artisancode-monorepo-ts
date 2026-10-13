import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBirthdayGreetingUsecase } from '@/contracts/birthday_greeting.contract'
import * as Entity from '@/entities/birthday_greeting.entity'

import { createBirthdayGreetingHandler } from '../birthday_greeting.handler'

describe('BirthdayGreetingHandler - update', () => {
  const mockSettings: Entity.BirthdayGreetingSettings = {
    id: 'bg-1',
    message: 'Selamat Ulang Tahun Baru {{nama}}!',
    enabled: true,
    audienceGender: null,
    audienceReligion: null,
    audienceSegmentationId: null,
    audienceCustomerStatus: null,
    updatedAt: new Date(),
  }

  const mockUsecase = {
    update: mock(async () => mockSettings),
  } as unknown as IBirthdayGreetingUsecase

  const handler = createBirthdayGreetingHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.patch('/', (c) => {
    c.set('body', { message: 'Selamat Ulang Tahun Baru {{nama}}!', enabled: true } as any)
    return handler.update(c)
  })

  it('should return 200 with updated birthday greeting settings', async () => {
    const res = await app.request('/', { method: 'PATCH' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.message).toBe('Selamat Ulang Tahun Baru {{nama}}!')
    expect(mockUsecase.update).toHaveBeenCalled()
  })
})
