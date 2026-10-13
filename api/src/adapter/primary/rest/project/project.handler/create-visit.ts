import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProjectUsecase } from '@/contracts/project.contract'

export function createProjectVisitHandler(usecase: IProjectUsecase) {
  return async (c: Context<AppEnv>) => {
    const data = await usecase.createVisit(c.get('body'))
    return c.json(responseSuccess(data, 'Project visit created successfully'), 201)
  }
}
