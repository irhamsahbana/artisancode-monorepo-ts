import * as Entity from '@/entities/product.entity'

import { ProductUsecaseDeps } from '../product.usecase'

export async function findProductList(
  deps: ProductUsecaseDeps,
  req: Entity.GetProductReq,
): Promise<Entity.ProductList> {
  return deps.repo.findList(req)
}
