import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IRoleAndPermissionUsecase } from '@/contracts/role_and_permission.contract'

export function deleteRoleHandler(usecase: IRoleAndPermissionUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''

    await usecase.deleteRole(id)
    return c.json(responseSuccess(null, 'Role deleted successfully'))
  }
}
