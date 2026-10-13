import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBusinessProfileUsecase } from '@/contracts/business_profile.contract'
import * as Entity from '@/entities/business_profile.entity'

import { createBusinessProfileHandler } from '../business_profile.handler'

describe('BusinessProfileHandler - update', () => {
  const mockProfile: Entity.BusinessProfile = {
    id: 'bp-1',
    name: 'PT Wijaya Karya Updated',
    businessType: 'BUMN Konstruksi',
    phone: '81234567890',
    countryCode: '62',
    email: 'info@wika.co.id',
    address: 'Jakarta Timur',
    whatsappDeviceId: 'dev-1',
    iconFilename: 'icon.png',
  }

  const mockUsecase = {
    update: mock(async () => mockProfile),
  } as unknown as IBusinessProfileUsecase

  const handler = createBusinessProfileHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.patch('/', (c) => {
    c.set('body', {
      name: 'PT Wijaya Karya Updated',
      business_type: 'BUMN Konstruksi',
      phone: '81234567890',
      country_code: '62',
      email: 'info@wika.co.id',
      address: 'Jakarta Timur',
    } as any)
    return handler.update(c)
  })

  it('should return 200 with updated business profile', async () => {
    const res = await app.request('/', { method: 'PATCH' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('PT Wijaya Karya Updated')
    expect(mockUsecase.update).toHaveBeenCalled()
  })
})
