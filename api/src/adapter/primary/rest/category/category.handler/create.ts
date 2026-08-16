import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { ICategoryUsecase } from '@/contracts/category.contract'
import * as Entity from '@/entities/category.entity'

export function createCategoryHandler(usecase: ICategoryUsecase) {
  return async (c: Context<AppEnv>) => {
    const body = c.get('body')
    const payload: Entity.CreateCategoryReq = {
      ...body,
    }

    const data = await usecase.create(payload)
    return c.json(responseSuccess(data, 'Category created successfully'), 201)
  }
}
