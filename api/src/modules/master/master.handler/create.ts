import { AppEnv, ErrorCode } from '@artisancode/types'
import { Context } from 'hono'

import { responseError, responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { IMasterUsecase } from '@/contracts/master.contract'
import { masterTypeSlugMap } from '@/entities/master.entity'

export function createMasterItemHandler(usecase: IMasterUsecase) {
  return async (c: Context<AppEnv>) => {
    const slug = c.req.param('type') ?? ''
    const type = masterTypeSlugMap[slug]
    if (!type) {
      return c.json(
        responseError('Invalid master type', undefined, ErrorCode.VALIDATION_ERROR),
        400,
      )
    }

    const body = c.get('body')
    const user = getUserContext()
    const companyId = user?.company_id || ''

    const data = await usecase.create({ company_id: companyId, type, name: body.name })
    return c.json(responseSuccess(data, 'Item created successfully'), 201)
  }
}
