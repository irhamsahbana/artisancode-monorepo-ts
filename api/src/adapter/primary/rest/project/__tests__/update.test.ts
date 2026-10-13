import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - update', () => {
  const mockProject: Entity.Project = {
    id: 'p-1',
    projectNumber: 'PRJ-12345678',
    customerId: 'c-1',
    contactId: null,
    name: 'Proyek Tol Cisumdawu Updated',
    location: 'Sumedang',
    latitude: null,
    longitude: null,
    sourceOfFunds: 'APBN',
    picName: 'Pak Joko',
    status: 'in_progress',
    estimatedValue: 6000000000,
    spkNumber: null,
    lostReason: null,
    winnerCompetitor: null,
    products: [],
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    update: mock(async () => mockProject),
  } as unknown as IProjectUsecase

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.put('/:id', (c) => {
    c.set('body', { name: 'Proyek Tol Cisumdawu Updated', status: 'in_progress' } as any)
    return handler.update(c)
  })

  it('should return 200 with updated project', async () => {
    const res = await app.request('/p-1', { method: 'PUT' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.name).toBe('Proyek Tol Cisumdawu Updated')
    expect(mockUsecase.update).toHaveBeenCalledWith({
      id: 'p-1',
      name: 'Proyek Tol Cisumdawu Updated',
      status: 'in_progress',
    })
  })
})
