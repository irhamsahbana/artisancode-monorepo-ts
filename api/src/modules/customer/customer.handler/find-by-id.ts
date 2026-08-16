import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { ICustomerUsecase } from '@/contracts/customer.contract'

export function findCustomerByIdHandler(usecase: ICustomerUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const data = await usecase.findById(id)
    return c.json(responseSuccess(data))
  }
}
