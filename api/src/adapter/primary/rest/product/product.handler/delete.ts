import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProductUsecase } from '@/contracts/product.contract'

export function deleteProductHandler(usecase: IProductUsecase) {
  return async (c: Context<AppEnv>) => {
    await usecase.delete(c.req.param('id') as string)
    return c.json(responseSuccess(null, 'Product deleted successfully'))
  }
}
