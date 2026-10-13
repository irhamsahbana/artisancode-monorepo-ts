import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IUomUsecase } from '@/contracts/uom.contract'

export function updateUomHandler(usecase: IUomUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.updateUom({ ...c.get('body'), id: c.req.param('id') as string })
    return c.json(responseSuccess(data, 'Unit of measurement updated successfully'))
  }
}
