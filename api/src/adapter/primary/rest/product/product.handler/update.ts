import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProductUsecase } from '@/contracts/product.contract'
import * as Entity from '@/entities/product.entity'

export function updateProductHandler(usecase: IProductUsecase) {
  return async (c: Context<AppEnv>) => {
    const payload: Entity.UpdateProductReq = { ...c.get('body'), id: c.req.param('id') as string }
    const data = await usecase.update(payload)
    return c.json(responseSuccess(data, 'Product updated successfully'))
  }
}
