import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProductUsecase } from '@/contracts/product.contract'

export function findProductListHandler(usecase: IProductUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, per_page, q, is_active } = query as Record<string, string>

    const data = await usecase.findList({
      q,
      isActive: is_active !== undefined ? is_active === 'true' : undefined,
      pagination: { page: Number(page) || 1, per_page: Number(per_page) || 100 },
    })
    return c.json(responseSuccess(data))
  }
}
