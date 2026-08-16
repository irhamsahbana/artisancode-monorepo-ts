import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { ICategoryUsecase } from '@/contracts/category.contract'
import * as Entity from '@/entities/category.entity'

export function updateCategoryHandler(usecase: ICategoryUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const body = c.get('body')

    const payload: Entity.UpdateCategoryReq = {
      ...body,
      id,
    }

    const data = await usecase.update(payload)
    return c.json(responseSuccess(data, 'Category updated successfully'))
  }
}
