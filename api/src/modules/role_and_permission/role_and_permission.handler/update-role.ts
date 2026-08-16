import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IRoleAndPermissionUsecase } from '@/contracts/role_and_permission.contract'
import * as Entity from '@/entities/role.entity'

export function updateRoleHandler(usecase: IRoleAndPermissionUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const body = c.get('body')

    const payload = { ...body, id } as Entity.UpdateRoleReq

    const data = await usecase.updateRole(payload)
    return c.json(responseSuccess(data, 'Role updated successfully'))
  }
}
