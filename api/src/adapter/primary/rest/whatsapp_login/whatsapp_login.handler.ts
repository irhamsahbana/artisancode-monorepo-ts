import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'
import * as Entity from '@/entities/whatsapp_login.entity'

export function createWhatsAppLoginHandler(usecase: IWhatsAppLoginUsecase) {
  return {
    request: async (c: Context<AppEnv>) => {
      const payload = c.get('body') as Entity.RequestWhatsAppLoginReq
      const data = await usecase.request(payload)
      return c.json(responseSuccess(data))
    },

    status: async (c: Context<AppEnv>) => {
      const id = c.req.param('id') ?? ''
      const data = await usecase.getStatus(id)
      return c.json(responseSuccess(data))
    },
  }
}
