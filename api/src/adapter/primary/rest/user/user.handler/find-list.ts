import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IUserUsecase } from '@/contracts/user.contract'
import * as Entity from '@/entities/user.entity'

export function findUserListHandler(usecase: IUserUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, limit, per_page, q } = query as {
      page: number
      limit: number
      per_page?: number
      q: string
    }

    const payload: Entity.GetUserReq = {
      pagination: {
        page: Number(page) || 1,
        per_page: Number(per_page ?? limit) || 10,
      },
    }

    if (q) {
      payload.username = q
    }
    const data = await usecase.findList(payload)
    return c.json(responseSuccess(data))
  }
}
