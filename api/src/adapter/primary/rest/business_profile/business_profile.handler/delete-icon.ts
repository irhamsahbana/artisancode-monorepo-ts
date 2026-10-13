import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { responseSuccess } from '@/common/rest_response'
import { deleteIcon } from '@/common/storage/branding-storage'
import { IBusinessProfileUsecase } from '@/contracts/business_profile.contract'

export function deleteBusinessProfileIconHandler(usecase: IBusinessProfileUsecase) {
  return async (c: Context<AppEnv>) => {
    await deleteIcon()
    const data = await usecase.update({ iconFilename: null })
    return c.json(responseSuccess(data, 'Icon dihapus'))
  }
}
