import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IContactUsecase } from '@/contracts/contact.contract'

export function searchContactsHandler(usecase: IContactUsecase) {
  return async (c: Context<AppEnv>) => {
    const q = c.req.query('q')
    const data = await usecase.search(q)
    return c.json(responseSuccess(data))
  }
}
