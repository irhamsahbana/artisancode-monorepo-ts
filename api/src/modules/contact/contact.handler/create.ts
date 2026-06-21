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
      email: body.email,
      notes: body.notes,
      isPrimary: body.is_primary,
    })
    return c.json(responseSuccess(data, 'Contact created successfully'), 201)
  }
}
