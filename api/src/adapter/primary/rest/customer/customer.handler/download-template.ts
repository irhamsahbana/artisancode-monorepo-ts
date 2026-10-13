import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { ICustomerUsecase } from '@/contracts/customer.contract'

export function downloadCustomerTemplateHandler(usecase: ICustomerUsecase) {
  return async (_c: Context<AppEnv>) => {
    const buffer = await usecase.generateTemplate()

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template_import_customer_crm_wika.xlsx"',
      },
    })
  }
}
