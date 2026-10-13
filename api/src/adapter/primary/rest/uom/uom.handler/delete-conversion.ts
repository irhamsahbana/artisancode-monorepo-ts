import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IUomUsecase } from '@/contracts/uom.contract'

export function deleteConversionHandler(usecase: IUomUsecase) {
  return async (c: Context<AppEnv>) => {
    await usecase.deleteConversion(c.req.param('id') as string)
    return c.json(responseSuccess(null, 'Unit conversion deleted successfully'))
  }
}
