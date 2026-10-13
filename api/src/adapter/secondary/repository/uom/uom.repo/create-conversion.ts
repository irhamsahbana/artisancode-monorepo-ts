import { getExecutor } from '@/common/executor'
import { unitConversions } from '@/db/schema'
import * as Entity from '@/entities/uom.entity'

import { UomRepoDeps } from '../uom.repo'

export async function createConversion(
  deps: UomRepoDeps,
  req: Entity.CreateUnitConversionReq,
): Promise<Entity.UnitConversion> {
  const [row] = await getExecutor()
    .insert(unitConversions)
    .values({
      fromUnitId: req.fromUnitId,
      toUnitId: req.toUnitId,
      factor: String(req.factor),
    })
    .returning()
  return deps.conversionToEntity(row)
}
