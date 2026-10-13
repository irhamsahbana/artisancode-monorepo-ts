import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

export function addDeviceHandler() {
  return async (c: Context<AppEnv>) => {
    const data = await getWhatsAppProvider().addDevice()
    return c.json(responseSuccess(data))
  }
}
