import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IUomUsecase } from '@/contracts/uom.contract'

export function findConversionListHandler(usecase: IUomUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, per_page } = query as Record<string, string>

    const data = await usecase.findConversionList({
      pagination: { page: Number(page) || 1, per_page: Number(per_page) || 100 },
    })
    return c.json(responseSuccess(data))
  }
}
