import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - findAllVisits', () => {
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
    findAllVisits: mock(async () => [mockVisit]),
  } as unknown as IProjectUsecase

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/visits', (c) => handler.findAllVisits(c))

  it('should return 200 with all project visits', async () => {
    const res = await app.request('/visits')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].id).toBe('pv-1')
    expect(mockUsecase.findAllVisits).toHaveBeenCalled()
  })
})
