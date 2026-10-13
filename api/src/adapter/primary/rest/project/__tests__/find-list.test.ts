import { AppEnv } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - findList', () => {
  const mockProject: Entity.Project = {
    id: 'p-1',
    projectNumber: 'PRJ-12345678',
    customerId: 'c-1',
    contactId: null,
    name: 'Proyek Tol Cisumdawu',
    location: 'Sumedang',
    latitude: null,
    longitude: null,
    sourceOfFunds: 'APBN',
    picName: 'Pak Joko',
    status: 'prospect',
    estimatedValue: 5000000000,
    spkNumber: null,
    lostReason: null,
    winnerCompetitor: null,
    products: [],
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsecase = {
    findList: mock(async () => ({
      items: [mockProject],
      pagination: { total: 1, page: 1, per_page: 10, last_page: 1 },
    })),
  } as unknown as IProjectUsecase

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.get('/', (c) => handler.findList(c))

  it('should return 200 with project list', async () => {
    const res = await app.request('/?page=1&per_page=10&status=prospect')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.items).toHaveLength(1)
    expect(json.data.items[0].id).toBe('p-1')
    expect(mockUsecase.findList).toHaveBeenCalled()
  })
})
