import { AppEnv, ErrorCode } from '@artisancode/types'
import { Context } from 'hono'

import { responseError, responseSuccess } from '@/common/rest_response'
import { ICategoryUsecase } from '@/contracts/category.contract'

export function findCategoryByIdHandler(usecase: ICategoryUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''

    const data = await usecase.findById(id)
    if (!data) {
      return c.json(responseError('Category not found', undefined, ErrorCode.NOT_FOUND), 404)
    }
    return c.json(responseSuccess(data))
  }
}
