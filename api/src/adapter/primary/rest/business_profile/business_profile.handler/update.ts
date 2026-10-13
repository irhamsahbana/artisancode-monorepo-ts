import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IBusinessProfileUsecase } from '@/contracts/business_profile.contract'
import * as Entity from '@/entities/business_profile.entity'

export function updateBusinessProfileHandler(usecase: IBusinessProfileUsecase) {
  return async (c: Context<AppEnv>) => {
    const body = c.get('body')

    const payload: Entity.UpdateBusinessProfileReq = {
      name: body.name,
      businessType: body.business_type,
      phone: body.phone,
      countryCode: body.country_code,
      email: body.email,
      address: body.address,
    }

    const data = await usecase.update(payload)
    return c.json(responseSuccess(data, 'Business profile updated successfully'))
  }
}
