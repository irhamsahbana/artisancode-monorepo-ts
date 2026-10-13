import { AppEnv, AppError } from '@artisancode/types'
import { describe, expect, it, mock } from 'bun:test'
import { Hono } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

import { createProjectHandler } from '../project.handler'

describe('ProjectHandler - executeImport', () => {
  const mockExecuteResult: Entity.ProjectImportExecuteResult = {
    createdProjects: 3,
    updatedProjects: 1,
    skippedProjects: 0,
    attachedProducts: 2,
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
    dryRunImport: mock(async () => ({}) as any),
    executeImport: mock(async () => mockExecuteResult),
  }

  const handler = createProjectHandler(mockUsecase)
  const app = new Hono<AppEnv>()
  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json({ success: false, message: err.message }, 400)
    }
    return c.json({ success: false, message: 'Internal server error' }, 500)
  })
  app.post('/import', handler.executeImport)

  it('should execute import with uploaded excel file and mode', async () => {
    const formData = new FormData()
    const dummyBlob = new Blob(['sample-excel-content'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    formData.append('file', dummyBlob, 'projects.xlsx')
    formData.append('mode', 'upsert')

    const res = await app.request('/import', {
      method: 'POST',
      body: formData,
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.created_projects).toBe(3)
    expect(json.data.updated_projects).toBe(1)
    expect(json.data.attached_products).toBe(2)
    expect(mockUsecase.executeImport).toHaveBeenCalled()
  })

  it('should reject when file is not provided', async () => {
    const formData = new FormData()
    const res = await app.request('/import', {
      method: 'POST',
      body: formData,
    })

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.message).toContain('File Excel wajib diunggah')
  })
})
