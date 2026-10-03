import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { ICustomerUsecase } from '@/contracts/customer.contract'
import * as Entity from '@/entities/customer.entity'

export function updateCustomerHandler(usecase: ICustomerUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const body = c.get('body')

    const payload: Entity.UpdateCustomerReq = {
      id,
      name: body.name,
      categoryId: body.category_id,
      segmentationId: body.segmentation_id,
      areaId: body.area_id,
      status: body.status,
      potential: body.potential,
      hasContractHistory: body.has_contract_history,
      lastRevenue: body.last_revenue,
      lastContractYear: body.last_contract_year,
      primaryContactId: body.primary_contact_id,
      companyType: body.company_type,
      address: body.address,
      npwp: body.npwp,
      skt: body.skt,
      companyEmail: body.company_email,
      website: body.website,
      notes: body.notes,
    }

    const data = await usecase.update(payload)
    return c.json(responseSuccess(data, 'Customer updated successfully'))
  }
}
