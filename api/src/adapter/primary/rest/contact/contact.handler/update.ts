import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IContactUsecase } from '@/contracts/contact.contract'

export function updateContactHandler(usecase: IContactUsecase) {
  return async (c: Context<AppEnv>) => {
    const id = c.req.param('id') ?? ''
    const body = c.get('body')

    // customer_id must come from query param since it's not in the update body schema
    const customerId = c.req.query('customer_id') || ''

    const data = await usecase.update({
      id,
      customer_id: customerId,
      name: body.name,
      position: body.position,
      whatsapp: body.whatsapp,
      email: body.email,
      notes: body.notes,
      isPrimary: body.is_primary,
    })

    return c.json(responseSuccess(data, 'Contact updated successfully'))
  }
}
