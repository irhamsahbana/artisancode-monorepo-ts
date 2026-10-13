import { getExecutor } from '@/common/executor'
import { uoms } from '@/db/schema'
import * as Entity from '@/entities/uom.entity'

import { UomRepoDeps } from '../uom.repo'

export async function createUom(
  deps: UomRepoDeps,
  req: Entity.CreateUomReq,
): Promise<Entity.UnitOfMeasurement> {
  const [row] = await getExecutor()
    .insert(uoms)
    .values({ name: req.name, symbol: req.symbol, category: req.category })
    .returning()
  return deps.uomToEntity(row)
}
