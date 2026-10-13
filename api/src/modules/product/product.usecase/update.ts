import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/product.entity'

import { ProductUsecaseDeps } from '../product.usecase'

export async function updateProduct(
  deps: ProductUsecaseDeps,
  req: Entity.UpdateProductReq,
): Promise<Entity.Product> {
  const item = await deps.repo.update(req)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
  return item
}
