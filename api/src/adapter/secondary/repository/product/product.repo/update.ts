import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { products } from '@/db/schema'
import * as Entity from '@/entities/product.entity'

import { ProductRepoDeps } from '../product.repo'

export async function updateProduct(
  deps: ProductRepoDeps,
  req: Entity.UpdateProductReq,
): Promise<Entity.Product | null> {
  const updates: Partial<typeof products.$inferInsert> = { updatedAt: new Date() }
  if (req.name !== undefined) updates.name = req.name
  if (req.unit !== undefined) updates.unit = req.unit
  if (req.isActive !== undefined) updates.status = req.isActive ? 'active' : 'inactive'

  const [row] = await getExecutor()
    .update(products)
    .set(updates)
    .where(and(eq(products.id, req.id), isNull(products.deletedAt)))
    .returning()
  return row ? deps.toEntity(row) : null
}
