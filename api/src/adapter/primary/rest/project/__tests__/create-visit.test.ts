import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - createVisit', () => {
  const mockVisit: Entity.ProjectVisit = {
    id: 'pv-1',
    projectId: 'p-1',
    visitDate: '2026-03-01',
    metWith: 'Pak Budi',
    topic: 'Pembahasan spek beton',
    notes: 'Kunjungan lancar',
    createdAt: new Date(),
  }

  const mockUsecase = {
    createVisit: mock(async () => mockVisit),
  } as unknown as IProjectUsecase

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/visits', (c) => {
    c.set('body', {
      projectId: 'p-1',
      visitDate: '2026-03-01',
      metWith: 'Pak Budi',
      topic: 'Pembahasan spek beton',
    } as any)
    return handler.createVisit(c)
  })

  it('should return 201 with created project visit', async () => {
    const res = await app.request('/visits', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('pv-1')
    expect(json.data.project_id).toBe('p-1')
    expect(mockUsecase.createVisit).toHaveBeenCalled()
  })
})
