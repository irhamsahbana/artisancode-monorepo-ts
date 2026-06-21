import { AppEnv, ErrorCode } from '@artisancode/types'
import { Context } from 'hono'

import { responseError, responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { IMasterUsecase } from '@/contracts/master.contract'
import { masterTypeSlugMap } from '@/entities/master.entity'

export function findMasterItemListHandler(usecase: IMasterUsecase) {
  return async (c: Context<AppEnv>) => {
    const slug = c.req.param('type') ?? ''
    const type = masterTypeSlugMap[slug]
    if (!type) {
      return c.json(
        responseError('Invalid master type', undefined, ErrorCode.VALIDATION_ERROR),
        400,
      )
    }

    const query = c.get('body')?._query || c.req.query()
    const { page, per_page, q, is_active } = query as {
      page: string
      per_page: string
      q: string
      is_active: string
    }
    const user = getUserContext()

    const data = await usecase.findList({
      company_id: user?.company_id || '',
      type,
      q,
      isActive: is_active !== undefined ? is_active === 'true' : undefined,
      pagination: {
        page: Number(page) || 1,
        per_page: Number(per_page) || 10,
      },
    })

    return c.json(responseSuccess(data))
  }
}
