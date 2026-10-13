import { getExecutor } from '@/common/executor'
import { products } from '@/db/schema'
import * as Entity from '@/entities/product.entity'

import { ProductRepoDeps } from '../product.repo'

export async function createProduct(
  deps: ProductRepoDeps,
  req: Entity.CreateProductReq,
): Promise<Entity.Product> {
  const [row] = await getExecutor()
    .insert(products)
    .values({ name: req.name, unit: req.unit })
    .returning()
  return deps.toEntity(row)
}
