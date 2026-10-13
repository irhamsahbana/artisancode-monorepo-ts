import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IContactUsecase } from '@/contracts/contact.contract'

import { createContactHandler } from '../contact.handler'

describe('ContactHandler - searchPersons', () => {
  const mockUsecase = {
    searchPersons: mock(async () => ({
      items: [],
      pagination: { total: 0, page: 1, per_page: 10, last_page: 1 },
    })),
  } as unknown as IContactUsecase

  const handler = createContactHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/search-persons', handler.searchPersons)

  it('should return 200 with search persons result', async () => {
    const res = await app.request('/search-persons')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.searchPersons).toHaveBeenCalled()
  })
})
