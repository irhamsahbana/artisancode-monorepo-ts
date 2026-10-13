import * as Entity from '@/entities/product.entity'

import { ProductUsecaseDeps } from '../product.usecase'

export async function createProduct(
  deps: ProductUsecaseDeps,
  req: Entity.CreateProductReq,
): Promise<Entity.Product> {
  return deps.repo.create(req)
}
