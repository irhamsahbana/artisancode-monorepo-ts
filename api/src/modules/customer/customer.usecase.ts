import { AppError, ErrorCode } from '@artisancode/types'

import { ICustomerRepo, ICustomerUsecase } from '@/contracts/customer.contract'

export interface CustomerUsecaseDeps {
  repo: ICustomerRepo
}

export function createCustomerUsecase(repo: ICustomerRepo): ICustomerUsecase {
  const deps: CustomerUsecaseDeps = { repo }

  return {
    create: (req) => deps.repo.create(req),

    findById: async (id, companyId) => {
      const item = await deps.repo.findById(id, companyId)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Customer not found')
      return item
    },

    findList: (req) => deps.repo.findList(req),

    update: async (req) => {
      const item = await deps.repo.update(req)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Customer not found')
      return item
    },

    delete: async (id, companyId) => {
      const item = await deps.repo.findById(id, companyId)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Customer not found')
      await deps.repo.delete(id, companyId)
    },
  }
}
