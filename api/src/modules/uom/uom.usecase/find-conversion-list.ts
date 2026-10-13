import * as Entity from '@/entities/uom.entity'

import type { UomUsecaseDeps } from '../uom.usecase'

export async function findConversionList(
  deps: UomUsecaseDeps,
  req: Entity.GetUomReq,
): Promise<Entity.UnitConversionList> {
  return deps.repo.findConversionList(req)
}
