import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IQuotationUsecase } from '@/contracts/quotation.contract'

export function createQuotationHandler(usecase: IQuotationUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.create(c.get('body'))
    return c.json(responseSuccess(data, 'Quotation request created successfully'), 201)
  }
}
