import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IQuotationUsecase } from '@/contracts/quotation.contract'

export function createQuotationHandler(usecase: IQuotationUsecase) {
  return {
    // Public: submitted from the /rfq web form without auth
    create: async (c: Context<AppEnv>) => {
      const data = await usecase.create(c.get('body'))
      return c.json(responseSuccess(data, 'Quotation request created successfully'), 201)
    },

    findList: async (c: Context<AppEnv>) => {
      const query = c.get('body')?._query || c.req.query()
      const { page, per_page } = query as Record<string, string>
      const data = await usecase.findList(Number(page) || 1, Number(per_page) || 10)
      return c.json(responseSuccess(data))
    },

    updateStatus: async (c: Context<AppEnv>) => {
      const data = await usecase.updateStatus({ ...c.get('body'), id: c.req.param('id') as string })
      return c.json(responseSuccess(data, 'Quotation status updated successfully'))
    },

    assignProject: async (c: Context<AppEnv>) => {
      const data = await usecase.assignProject({
        ...c.get('body'),
        id: c.req.param('id') as string,
      })
      return c.json(responseSuccess(data, 'Quotation assigned to project successfully'))
    },
  }
}
