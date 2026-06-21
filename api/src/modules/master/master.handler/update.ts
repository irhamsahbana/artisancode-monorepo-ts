import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { IMasterUsecase } from '@/contracts/master.contract'

export function updateMasterItemHandler(usecase: IMasterUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const body = c.get('body')
    const user = getUserContext()

    const data = await usecase.update({
      id,
      company_id: user?.company_id || '',
      name: body.name,
      isActive: body.is_active,
    })

    return c.json(responseSuccess(data, 'Item updated successfully'))
  }
}
