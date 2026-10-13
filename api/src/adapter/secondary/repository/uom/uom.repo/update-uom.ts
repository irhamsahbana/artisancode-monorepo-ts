import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { uoms } from '@/db/schema'
import * as Entity from '@/entities/uom.entity'

import { UomRepoDeps } from '../uom.repo'

export async function updateUom(
  deps: UomRepoDeps,
  req: Entity.UpdateUomReq,
): Promise<Entity.UnitOfMeasurement | null> {
  const updates: Partial<typeof uoms.$inferInsert> = { updatedAt: new Date() }
  if (req.name !== undefined) updates.name = req.name
  if (req.symbol !== undefined) updates.symbol = req.symbol
  if (req.category !== undefined) updates.category = req.category
  if (req.isActive !== undefined) updates.isActive = req.isActive

  const [row] = await getExecutor()
    .update(uoms)
    .set(updates)
    .where(and(eq(uoms.id, req.id), isNull(uoms.deletedAt)))
    .returning()
  return row ? deps.uomToEntity(row) : null
}
