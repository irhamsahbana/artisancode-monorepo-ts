import { AppEnv, AppError } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - dryRunImport', () => {
  const mockDryRunResult: Entity.ProjectImportDryRunResult = {
    totalProjects: 1,
    validProjects: 1,
    totalProducts: 1,
    validProducts: 1,
    errors: [],
    previewProjects: [
      {
        rowNumber: 2,
        name: 'Pembangunan Jembatan Cisadane',
        customerName: 'PT Wijaya Konstruksi',
        status: 'in_progress',
        estimatedValue: 2500000000,
      },
    ],
    previewProducts: [
      {
        rowNumber: 2,
        projectRef: 'Pembangunan Jembatan Cisadane',
        productName: 'Beton K-350',
        quantity: 500,
      },
    ],
  }

  const mockUsecase: IProjectUsecase = {
    create: mock(async () => ({}) as any),
    findById: mock(async () => ({}) as any),
    findList: mock(async () => ({}) as any),
    findMapMarkers: mock(async () => []),
    update: mock(async () => ({}) as any),
    delete: mock(async () => {}),
    createVisit: mock(async () => ({}) as any),
    findVisitsByProjectId: mock(async () => []),
    findAllVisits: mock(async () => []),
    generateTemplate: mock(async () => Buffer.from('')),
    dryRunImport: mock(async () => mockDryRunResult),
    executeImport: mock(async () => ({}) as any),
  }

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json({ success: false, message: err.message }, 400)
    }
    return c.json({ success: false, message: 'Internal server error' }, 500)
  })
  app.post('/import/dry-run', handler.dryRunImport)

  it('should parse uploaded excel file and return dry-run validation result', async () => {
    const formData = new FormData()
    const dummyBlob = new Blob(['sample-excel-content'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    formData.append('file', dummyBlob, 'projects.xlsx')

    const res = await app.request('/import/dry-run', {
      method: 'POST',
      body: formData,
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.total_projects).toBe(1)
    expect(json.data.valid_projects).toBe(1)
    expect(json.data.preview_projects[0].name).toBe('Pembangunan Jembatan Cisadane')
    expect(mockUsecase.dryRunImport).toHaveBeenCalled()
  })

  it('should reject when file is not provided', async () => {
    const formData = new FormData()
    const res = await app.request('/import/dry-run', {
      method: 'POST',
      body: formData,
    })

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.message).toContain('File Excel wajib diunggah')
  })
})
