import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import { ICustomerUsecase } from '@/contracts/customer.contract'
import * as Entity from '@/entities/customer.entity'

export function createCustomerHandler(usecase: ICustomerUsecase) {
  return async (c: Context<AppEnv>) => {
    const body = c.get('body')
    const user = getUserContext()

    const payload: Entity.CreateCustomerReq = {
      company_id: user?.company_id || '',
      name: body.name,
      type: body.type,
      categoryId: body.category_id,
      areaId: body.area_id,
      status: body.status,
      potential: body.potential,
      hasContractHistory: body.has_contract_history,
      lastRevenue: body.last_revenue,
      lastContractYear: body.last_contract_year,
      gender: body.gender,
      address: body.address,
      birthPlace: body.birth_place,
      dateOfBirth: body.date_of_birth,
      religion: body.religion,
      education: body.education,
      email: body.email,
      spouseName: body.spouse_name,
      spouseOccupation: body.spouse_occupation,
      childrenNames: body.children_names,
      childrenOccupation: body.children_occupation,
      character: body.character,
      hobby: body.hobby,
      companyName: body.company_name,
      position: body.position,
      companyAddress: body.company_address,
      whatsapp: body.whatsapp,
      notes: body.notes,
    }

    const data = await usecase.create(payload)
    return c.json(responseSuccess(data, 'Customer created successfully'), 201)
  }
}
