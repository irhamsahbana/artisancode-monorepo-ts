import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IContactUsecase } from '@/contracts/contact.contract'

export function createContactHandler(usecase: IContactUsecase) {
  return async (c: Context<AppEnv>) => {
    const body = c.get('body')
    const data = await usecase.create({
      customer_id: body.customer_id,
      name: body.name,
      position: body.position,
      whatsapp: body.whatsapp,
      country_code: body.country_code,
      email: body.email,
      gender: body.gender,
      birthPlace: body.birth_place,
      dateOfBirth: body.date_of_birth,
      religion: body.religion,
      education: body.education,
      address: body.address,
      spouseName: body.spouse_name,
      spouseOccupation: body.spouse_occupation,
      childrenNames: body.children_names,
      childrenOccupation: body.children_occupation,
      profiling: body.profiling,
      notes: body.notes,
      isPrimary: body.is_primary,
    })
    return c.json(responseSuccess(data, 'Contact created successfully'), 201)
  }
}
