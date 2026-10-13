import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBusinessProfileRepo } from '@/contracts/business_profile.contract'

export function setPrimaryDeviceHandler(businessProfileRepo: IBusinessProfileRepo) {
  return async (c: Context<AppEnv>) => {
    const deviceId = c.req.param('id') ?? ''
    await businessProfileRepo.update({ whatsappDeviceId: deviceId })
    return c.json(responseSuccess(null, 'Device utama diperbarui'))
  }
}
