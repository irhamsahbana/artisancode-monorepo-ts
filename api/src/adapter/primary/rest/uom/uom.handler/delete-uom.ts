import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IUomUsecase } from '@/contracts/uom.contract'

export function deleteUomHandler(usecase: IUomUsecase) {
  return async (c: Context<AppEnv>) => {
    await usecase.deleteUom(c.req.param('id') as string)
    return c.json(responseSuccess(null, 'Unit of measurement deleted successfully'))
  }
}
