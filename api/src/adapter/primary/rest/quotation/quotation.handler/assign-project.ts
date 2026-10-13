import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IQuotationUsecase } from '@/contracts/quotation.contract'

export function assignProjectHandler(usecase: IQuotationUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.assignProject({
      ...c.get('body'),
      id: c.req.param('id') as string,
    })
    return c.json(responseSuccess(data, 'Quotation assigned to project successfully'))
  }
}
