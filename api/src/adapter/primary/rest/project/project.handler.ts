import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

export function createProjectHandler(usecase: IProjectUsecase) {
  return {
    create: async (c: Context<AppEnv>) => {
      const data = await usecase.create(c.get('body'))
      return c.json(responseSuccess(data, 'Project created successfully'), 201)
    },

    findById: async (c: Context<AppEnv>) => {
      const data = await usecase.findById(c.req.param('id') as string)
      return c.json(responseSuccess(data))
    },

    findList: async (c: Context<AppEnv>) => {
      const query = c.get('body')?._query || c.req.query()
      const { page, per_page, q, status, customerId } = query as Record<string, string>

      const data = await usecase.findList({
        q,
        status: status as Entity.ProjectStatus | undefined,
        customerId,
        pagination: { page: Number(page) || 1, per_page: Number(per_page) || 10 },
      })
      return c.json(responseSuccess(data))
    },

    update: async (c: Context<AppEnv>) => {
      const data = await usecase.update({ ...c.get('body'), id: c.req.param('id') as string })
      return c.json(responseSuccess(data, 'Project updated successfully'))
    },

    delete: async (c: Context<AppEnv>) => {
      await usecase.delete(c.req.param('id') as string)
      return c.json(responseSuccess(null, 'Project deleted successfully'))
    },

    createVisit: async (c: Context<AppEnv>) => {
      const data = await usecase.createVisit(c.get('body'))
      return c.json(responseSuccess(data, 'Project visit created successfully'), 201)
    },

    findVisitsByProjectId: async (c: Context<AppEnv>) => {
      const data = await usecase.findVisitsByProjectId(c.req.param('id') as string)
      return c.json(responseSuccess(data))
    },

    findAllVisits: async (c: Context<AppEnv>) => {
      const data = await usecase.findAllVisits()
      return c.json(responseSuccess(data))
    },
  }
}
