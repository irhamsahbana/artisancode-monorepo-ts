import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProductUsecase } from '@/contracts/product.contract'

export function createProductHandler(usecase: IProductUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.create(c.get('body'))
    return c.json(responseSuccess(data, 'Product created successfully'), 201)
  }
}
