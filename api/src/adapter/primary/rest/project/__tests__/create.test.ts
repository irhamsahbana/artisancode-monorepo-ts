import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - create', () => {
  const mockProject: Entity.Project = {
    id: 'p-1',
    projectNumber: 'PRJ-12345678',
    customerId: 'c-1',
    contactId: 'ct-1',
    name: 'Proyek Tol Cisumdawu',
    location: 'Sumedang',
    latitude: -6.9,
    longitude: 107.9,
    sourceOfFunds: 'APBN',
    picName: 'Pak Joko',
    status: 'prospect',
    estimatedValue: 5000000000,
    spkNumber: 'SPK-001',
    lostReason: null,
    winnerCompetitor: null,
    products: [{ productId: 'prod-1', quantity: 100 }],
    notes: 'Catatan proyek',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    create: mock(async () => mockProject),
  } as unknown as IProjectUsecase

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.post('/', (c) => {
    c.set('body', { name: 'Proyek Tol Cisumdawu', customerId: 'c-1', location: 'Sumedang' } as any)
    return handler.create(c)
  })

  it('should return 201 with created project', async () => {
    const res = await app.request('/', { method: 'POST' })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('p-1')
    expect(json.data.project_number).toBe('PRJ-12345678')
    expect(mockUsecase.create).toHaveBeenCalled()
  })
})
