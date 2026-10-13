import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - findMapMarkers', () => {
  const mockMarker: Entity.ProjectMapMarker = {
    id: 'p-1',
    name: 'Proyek Tol Cisumdawu',
    status: 'prospect',
    location: 'Sumedang',
    estimatedValue: 5000000000,
    latitude: -6.9,
    longitude: 107.9,
    createdAt: new Date(),
  }

  const mockUsecase = {
    findMapMarkers: mock(async () => [mockMarker]),
  } as unknown as IProjectUsecase

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/map/markers', (c) => handler.findMapMarkers(c))

  it('should return 200 with map markers', async () => {
    const res = await app.request('/map/markers')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].id).toBe('p-1')
    expect(mockUsecase.findMapMarkers).toHaveBeenCalled()
  })
})
