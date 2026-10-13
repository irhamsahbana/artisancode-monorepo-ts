import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IBroadcastUsecase } from '@/contracts/broadcast.contract'

import { createBroadcastHandler } from '../broadcast.handler'

describe('BroadcastHandler - deleteTemplate', () => {
  const mockUsecase = {
    deleteTemplate: mock(async () => {}),
  } as unknown as IBroadcastUsecase

  const handler = createBroadcastHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.delete('/templates/:id', (c) => handler.deleteTemplate(c))

  it('should return 200 after deleting broadcast template', async () => {
    const res = await app.request('/templates/bt-1', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.deleteTemplate).toHaveBeenCalledWith('bt-1')
  })
})
