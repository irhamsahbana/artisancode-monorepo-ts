import { AppError, ErrorCode } from '@artisancode/types'

import { IProductRepo, IProductUsecase } from '@/contracts/product.contract'

export interface ProductUsecaseDeps {
  repo: IProductRepo
}

export function createProductUsecase(repo: IProductRepo): IProductUsecase {
  const deps: ProductUsecaseDeps = { repo }

  return {
    create: (req) => deps.repo.create(req),

    findList: (req) => deps.repo.findList(req),

    update: async (req) => {
      const item = await deps.repo.update(req)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
      return item
    },

    delete: (id) => deps.repo.delete(id),
  }
}
