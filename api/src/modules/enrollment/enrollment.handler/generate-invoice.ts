import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { IEnrollmentUsecase } from '@/contracts/enrollment.contract'
import * as Entity from '@/entities/enrollment.entity'

export function generateEnrollmentInvoiceHandler(usecase: IEnrollmentUsecase) {
  return async (c: Context<AppEnv>) => {
    return withSpan('EnrollmentHandler.generateInvoice', async () => {
      const id = c.req.param('id') ?? ''
      const user = getUserContext()

      const payload: Entity.GenerateEnrollmentInvoiceReq = {
        id,
        company_id: user?.company_id || '',
      }

      const data = await usecase.generateInvoice(payload)
      return c.json(responseSuccess(data, 'Invoice generated successfully'), 201)
    })
  }
}
