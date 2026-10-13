import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProjectUsecase } from '@/contracts/project.contract'
import * as Entity from '@/entities/project.entity'

export function findProjectListHandler(usecase: IProjectUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const { page, per_page, q, status, customerId } = query as Record<string, string>

    const data = await usecase.findList({
      q,
      status: status as Entity.ProjectStatus | undefined,
      customerId,
      pagination: { page: Number(page) || 1, per_page: Number(per_page) || 10 },
    })
    return c.json(responseSuccess(data))
  }
}
