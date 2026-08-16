import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IRatingUsecase } from '@/contracts/rating.contract'

export function createRatingHandler(usecase: IRatingUsecase) {
  return {
    create: async (c: Context<AppEnv>) => {
      const data = await usecase.create(c.get('body'))
      return c.json(responseSuccess(data, 'Customer rating created successfully'), 201)
    },

    findList: async (c: Context<AppEnv>) => {
      const query = c.get('body')?._query || c.req.query()
      const { page, per_page, customerId, contactId } = query as Record<string, string>

      const data = await usecase.findList({
        customerId,
        contactId,
        page: Number(page) || 1,
        per_page: Number(per_page) || 10,
      })
      return c.json(responseSuccess(data))
    },
  }
}
