import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IProjectUsecase } from '@/contracts/project.contract'

export function downloadProjectTemplateHandler(usecase: IProjectUsecase) {
  return async (_c: Context<AppEnv>) => {
    const buffer = await usecase.generateTemplate()

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template_import_project_crm_wika.xlsx"',
      },
    })
  }
}
