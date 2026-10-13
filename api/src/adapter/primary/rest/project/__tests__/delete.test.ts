import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - delete', () => {
  const mockUsecase = {
    delete: mock(async () => {}),
  } as unknown as IProjectUsecase

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.delete('/:id', (c) => handler.delete(c))

  it('should return 200 after deleting project', async () => {
    const res = await app.request('/p-1', { method: 'DELETE' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(mockUsecase.delete).toHaveBeenCalledWith('p-1')
  })
})
