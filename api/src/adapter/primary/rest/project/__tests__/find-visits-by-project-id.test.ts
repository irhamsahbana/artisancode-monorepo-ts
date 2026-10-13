import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - findVisitsByProjectId', () => {
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
    findVisitsByProjectId: mock(async () => [mockVisit]),
  } as unknown as IProjectUsecase

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/:id/visits', (c) => handler.findVisitsByProjectId(c))

  it('should return 200 with project visits by project id', async () => {
    const res = await app.request('/p-1/visits')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].id).toBe('pv-1')
    expect(mockUsecase.findVisitsByProjectId).toHaveBeenCalledWith('p-1')
  })
})
