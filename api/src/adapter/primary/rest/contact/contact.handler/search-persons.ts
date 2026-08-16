import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IContactUsecase } from '@/contracts/contact.contract'

export function searchContactPersonsHandler(usecase: IContactUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { q, page, per_page, gender, religion, segmentationId, customerStatus } = query as Record<
      string,
      string
    >

    const data = await usecase.searchPersons({
      q,
      gender,
      religion,
      segmentationId,
      customerStatus,
      pagination: {
        page: Number(page) || 1,
        per_page: Number(per_page) || 10,
      },
    })

    return c.json(responseSuccess(data))
  }
}
