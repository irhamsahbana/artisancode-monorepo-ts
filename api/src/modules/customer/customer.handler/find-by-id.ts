import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { ICustomerUsecase } from '@/contracts/customer.contract'

export function findCustomerByIdHandler(usecase: ICustomerUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const user = getUserContext()
    const data = await usecase.findById(id, user?.company_id || '')
    return c.json(responseSuccess(data))
  }
}
