import { AppError, ErrorCode } from '@artisancode/types'

import {
  IBusinessProfileRepo,
  IBusinessProfileUsecase,
} from '@/contracts/business_profile.contract'

export function createBusinessProfileUsecase(repo: IBusinessProfileRepo): IBusinessProfileUsecase {
  return {
    findByCompanyId: async (companyId) => {
      const item = await repo.findByCompanyId(companyId)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Business profile not found')
      return item
    },

    update: async (req) => {
      const item = await repo.update(req)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Business profile not found')
      return item
    },
  }
}
