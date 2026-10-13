import { AppEnv, AppError, ErrorCode } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import {
  ICON_EXT_BY_MIME,
  MAX_ICON_SIZE_BYTES,
  saveIcon,
} from '@/common/storage/branding-storage'
import { IBusinessProfileUsecase } from '@/contracts/business_profile.contract'

export function uploadBusinessProfileIconHandler(usecase: IBusinessProfileUsecase) {
  return async (c: Context<AppEnv>) => {
    const body = await c.req.parseBody()
    const file = body.file
    if (!(file instanceof File)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'File ikon wajib diunggah')
    }

    const ext = ICON_EXT_BY_MIME[file.type]
    if (!ext) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, `Tipe file tidak didukung: ${file.type}`)
    }
    if (file.size > MAX_ICON_SIZE_BYTES) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Ukuran file maksimal 2MB')
    }

    const filename = await saveIcon(file, ext)
    const data = await usecase.update({ iconFilename: filename })
    return c.json(responseSuccess(data, 'Icon berhasil diperbarui'))
  }
}
