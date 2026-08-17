import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBroadcastUsecase } from '@/contracts/broadcast.contract'

export function createBroadcastHandler(usecase: IBroadcastUsecase) {
  return {
    createTemplate: async (c: Context<AppEnv>) => {
      const data = await usecase.createTemplate(c.get('body'))
      return c.json(responseSuccess(data, 'Broadcast template created successfully'), 201)
    },

    findTemplateList: async (c: Context<AppEnv>) => {
      const query = c.get('body')?._query || c.req.query()
      const { page, per_page } = query as Record<string, string>
      const data = await usecase.findTemplateList(Number(page) || 1, Number(per_page) || 10)
      return c.json(responseSuccess(data))
    },

    findLogs: async (c: Context<AppEnv>) => {
      const data = await usecase.findLogs()
      return c.json(responseSuccess(data))
    },

    findLogsByTemplateId: async (c: Context<AppEnv>) => {
      const data = await usecase.findLogsByTemplateId(c.req.param('id') as string)
      return c.json(responseSuccess(data))
    },

    deleteTemplate: async (c: Context<AppEnv>) => {
      await usecase.deleteTemplate(c.req.param('id') as string)
      return c.json(responseSuccess(null, 'Broadcast template deleted successfully'))
    },

    send: async (c: Context<AppEnv>) => {
      const data = await usecase.send({ templateId: c.get('body').templateId })
      return c.json(responseSuccess(data, 'Broadcast sent successfully'))
    },
  }
}
