import { AppEnv, AppError, ErrorCode } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { IProjectUsecase } from '@/contracts/project.contract'

const MAX_EXCEL_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

export function dryRunProjectImportHandler(usecase: IProjectUsecase) {
  return async (c: Context<AppEnv>) => {
    const body = await c.req.parseBody()
    const file = body.file
    if (!(file instanceof File)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'File Excel wajib diunggah (.xlsx)')
    }

    if (
      !file.name.toLowerCase().endsWith('.xlsx') &&
      file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Hanya file format .xlsx yang didukung')
    }

    if (file.size > MAX_EXCEL_SIZE_BYTES) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Ukuran file maksimal 10MB')
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await usecase.dryRunImport(buffer)
    return c.json(responseSuccess(result, 'Validasi file import proyek selesai'))
  }
}
