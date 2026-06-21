import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IContactUsecase } from '@/contracts/contact.contract'

export function deleteContactHandler(usecase: IContactUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    await usecase.delete(id)
    return c.json(responseSuccess(null, 'Contact deleted successfully'))
  }
}
