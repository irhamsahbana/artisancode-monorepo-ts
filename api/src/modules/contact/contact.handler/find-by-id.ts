import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IContactUsecase } from '@/contracts/contact.contract'

export function findContactByIdHandler(usecase: IContactUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const data = await usecase.findById(id)
    return c.json(responseSuccess(data))
  }
}
