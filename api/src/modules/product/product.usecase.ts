import { IProductRepo, IProductUsecase } from '@/contracts/product.contract'

import { createProduct } from './product.usecase/create'
import { deleteProduct } from './product.usecase/delete'
import { findProductList } from './product.usecase/find-list'
import { updateProduct } from './product.usecase/update'

export interface ProductUsecaseDeps {
  repo: IProductRepo
}

export function createProductUsecase(repo: IProductRepo): IProductUsecase {
  const deps: ProductUsecaseDeps = { repo }

  return {
    create: (req) => createProduct(deps, req),
    findList: (req) => findProductList(deps, req),
    update: (req) => updateProduct(deps, req),
    delete: (id) => deleteProduct(deps, id),
  }
}

export default createProductUsecase
