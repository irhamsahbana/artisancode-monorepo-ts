import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IQuotationUsecase } from '@/contracts/quotation.contract'
import * as Entity from '@/entities/quotation.entity'

export function findQuotationListHandler(usecase: IQuotationUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, per_page, q, status } = query as Record<string, string>
    const data = await usecase.findList({
      q,
      status: status as Entity.QuotationStatus | undefined,
      pagination: { page: Number(page) || 1, per_page: Number(per_page) || 10 },
    })
    return c.json(responseSuccess(data))
  }
}
