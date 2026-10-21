import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { ICategoryUsecase } from '@/contracts/category.contract'
import * as Entity from '@/entities/category.entity'

export function findCategoryListHandler(usecase: ICategoryUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, limit, q, group, status, sort } = query as {
      page: number
      limit: number
      q: string
      group: string
      status?: Entity.CategoryStatus
      sort?: 'name'
    }

    const payload: Entity.GetCategoryReq = {
      q,
      group,
      status,
      sort,
      pagination: {
        page: Number(page) || 1,
        per_page: Number(limit) || 10,
      },
    }

    const data = await usecase.findList(payload)
    return c.json(responseSuccess(data))
  }
}
