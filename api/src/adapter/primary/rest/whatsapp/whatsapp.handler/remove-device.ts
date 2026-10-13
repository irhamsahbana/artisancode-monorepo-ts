import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

export function removeDeviceHandler() {
  return async (c: Context<AppEnv>) => {
    const deviceId = c.req.param('id') ?? ''
    await getWhatsAppProvider().removeDevice(deviceId)
    return c.json(responseSuccess(null, 'Device dihapus'))
  }
}
