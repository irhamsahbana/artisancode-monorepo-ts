import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IUomUsecase } from '@/contracts/uom.contract'
import * as Entity from '@/entities/uom.entity'

export function findUomListHandler(usecase: IUomUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, per_page, q, category, is_active } = query as Record<string, string>

    const data = await usecase.findUomList({
      q,
      category: category as Entity.UomCategory | undefined,
      isActive: is_active !== undefined ? is_active === 'true' : undefined,
      pagination: { page: Number(page) || 1, per_page: Number(per_page) || 100 },
    })
    return c.json(responseSuccess(data))
  }
}
