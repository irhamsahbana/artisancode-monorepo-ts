import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProjectUsecase } from '@/contracts/project.contract'

export function findVisitsByProjectIdHandler(usecase: IProjectUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.findVisitsByProjectId(c.req.param('id') as string)
    return c.json(responseSuccess(data))
  }
}
