import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IContactUsecase } from '@/contracts/contact.contract'

import { createContactHandler } from '../contact.handler'

describe('ContactHandler - delete', () => {
  const mockUsecase = {
    delete: mock(async () => {}),
  } as unknown as IContactUsecase

  const handler = createContactHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.delete('/:id', handler.delete)

  it('should return 200 after deleting contact', async () => {
    const res = await app.request('/ct-1', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.delete).toHaveBeenCalledWith('ct-1')
  })
})
