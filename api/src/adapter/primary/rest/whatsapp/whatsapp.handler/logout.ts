import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

export function logoutDeviceHandler() {
  return async (c: Context<AppEnv>) => {
    const deviceId = c.req.param('id') ?? ''
    await getWhatsAppProvider().logout(deviceId)
    return c.json(responseSuccess(null, 'WhatsApp device logged out'))
  }
}
