import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProjectUsecase } from '@/contracts/project.contract'

export function deleteProjectHandler(usecase: IProjectUsecase) {
  return async (c: Context<AppEnv>) => {
    await usecase.delete(c.req.param('id') as string)
    return c.json(responseSuccess(null, 'Project deleted successfully'))
  }
}
