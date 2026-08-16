import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { ICustomerUsecase } from '@/contracts/customer.contract'

export function deleteCustomerHandler(usecase: ICustomerUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    await usecase.delete(id)
    return c.json(responseSuccess(null, 'Customer deleted successfully'))
  }
}
