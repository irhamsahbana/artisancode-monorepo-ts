import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IContactUsecase } from '@/contracts/contact.contract'

export function findContactListHandler(usecase: IContactUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, per_page, customer_id } = query as Record<string, string>

    const data = await usecase.findList({
      customer_id,
      pagination: {
        page: Number(page) || 1,
        per_page: Number(per_page) || 100,
      },
    })

    return c.json(responseSuccess(data))
  }
}
