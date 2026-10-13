import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IUomUsecase } from '@/contracts/uom.contract'

export function createConversionHandler(usecase: IUomUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.createConversion(c.get('body'))
    return c.json(responseSuccess(data, 'Unit conversion created successfully'), 201)
  }
}
