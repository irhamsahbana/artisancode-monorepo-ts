import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

export function loginDeviceHandler() {
  return async (c: Context<AppEnv>) => {
    const deviceId = c.req.param('id') ?? ''
    const data = await getWhatsAppProvider().login(deviceId)
    return c.json(responseSuccess(data))
  }
}
