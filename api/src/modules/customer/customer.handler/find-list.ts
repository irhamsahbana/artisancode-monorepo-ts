import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { ICustomerUsecase } from '@/contracts/customer.contract'
import * as Entity from '@/entities/customer.entity'

export function findCustomerListHandler(usecase: ICustomerUsecase) {
  return async (c: Context<AppEnv>) => {
    const query = c.get('body')?._query || c.req.query()
    const {
      page,
      per_page,
      q,
      type,
      status,
      potential,
      category_id,
      area_id,
      has_contract_history,
    } = query as Record<string, string>
    const user = getUserContext()

    const payload: Entity.GetCustomerReq = {
      company_id: user?.company_id || '',
      q,
      type: type as Entity.CustomerType | undefined,
      status: status as Entity.CustomerStatus | undefined,
      potential: potential as Entity.CustomerPotential | undefined,
      categoryId: category_id,
      areaId: area_id,
      hasContractHistory:
        has_contract_history !== undefined ? has_contract_history === 'true' : undefined,
      pagination: {
        page: Number(page) || 1,
        per_page: Number(per_page) || 10,
      },
    }

    const data = await usecase.findList(payload)
    return c.json(responseSuccess(data))
  }
}
