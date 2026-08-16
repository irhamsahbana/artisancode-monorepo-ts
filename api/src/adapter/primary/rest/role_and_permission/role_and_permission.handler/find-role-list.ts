import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IRoleAndPermissionUsecase } from '@/contracts/role_and_permission.contract'
import * as Entity from '@/entities/role.entity'

export function findRoleListHandler(usecase: IRoleAndPermissionUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, limit, per_page, q, ids } = query as {
      page: number
      limit: number
      per_page?: number
      q: string
      ids: string
    }

    const payload: Entity.GetRoleReq = {
      q,
      ids: ids ? ids.split(',') : undefined,
      pagination: {
        page: Number(page) || 1,
        per_page: Number(per_page ?? limit) || 10,
      },
    }

    const data = await usecase.findRoleList(payload)
    return c.json(responseSuccess(data))
  }
}
