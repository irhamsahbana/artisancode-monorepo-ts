import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { unitConversions } from '@/db/schema'
import * as Entity from '@/entities/uom.entity'

import { UomRepoDeps } from '../uom.repo'

export async function updateConversion(
  deps: UomRepoDeps,
  req: Entity.UpdateUnitConversionReq,
): Promise<Entity.UnitConversion | null> {
  const updates: Partial<typeof unitConversions.$inferInsert> = { updatedAt: new Date() }
  if (req.fromUnitId !== undefined) updates.fromUnitId = req.fromUnitId
  if (req.toUnitId !== undefined) updates.toUnitId = req.toUnitId
  if (req.factor !== undefined) updates.factor = String(req.factor)

  const [row] = await getExecutor()
    .update(unitConversions)
    .set(updates)
    .where(and(eq(unitConversions.id, req.id), isNull(unitConversions.deletedAt)))
    .returning()
  return row ? deps.conversionToEntity(row) : null
}
