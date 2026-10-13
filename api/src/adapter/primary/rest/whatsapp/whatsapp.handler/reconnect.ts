import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

export function reconnectDeviceHandler() {
  return async (c: Context<AppEnv>) => {
    const deviceId = c.req.param('id') ?? ''
    await getWhatsAppProvider().reconnect(deviceId)
    return c.json(responseSuccess(null, 'Reconnecting WhatsApp device'))
  }
}
