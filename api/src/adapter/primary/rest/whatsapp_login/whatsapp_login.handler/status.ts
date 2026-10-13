import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'

export function getWhatsAppLoginStatusHandler(usecase: IWhatsAppLoginUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const data = await usecase.getStatus(id)
    return c.json(responseSuccess(data))
  }
}
