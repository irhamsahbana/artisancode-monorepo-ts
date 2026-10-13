import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

export function listDevicesHandler() {
  return async (c: Context<AppEnv>) => {
    const data = await getWhatsAppProvider().listDevices()
    return c.json(responseSuccess(data))
  }
}
