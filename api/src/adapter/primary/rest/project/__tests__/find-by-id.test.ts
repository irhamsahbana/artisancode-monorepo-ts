import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - findById', () => {
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
    findById: mock(async () => mockProject),
  } as unknown as IProjectUsecase

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/:id', (c) => handler.findById(c))

  it('should return 200 with project by id', async () => {
    const res = await app.request('/p-1')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('p-1')
    expect(mockUsecase.findById).toHaveBeenCalledWith('p-1')
  })
})
