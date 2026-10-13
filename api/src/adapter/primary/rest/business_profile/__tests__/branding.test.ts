import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBusinessProfileUsecase } from '@/contracts/business_profile.contract'

import { createBusinessProfileHandler } from '../business_profile.handler'

describe('BusinessProfileHandler - branding', () => {
  const mockUsecase = {
    branding: mock(async () => ({ name: 'CRM Wika' })),
  } as unknown as IBusinessProfileUsecase

  const handler = createBusinessProfileHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/branding', (c) => handler.branding(c))

  it('should return 200 with business branding', async () => {
    const res = await app.request('/branding')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('CRM Wika')
    expect(mockUsecase.branding).toHaveBeenCalled()
  })
})
