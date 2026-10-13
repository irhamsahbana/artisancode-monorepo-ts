import * as Entity from '@/entities/uom.entity'

import type { UomUsecaseDeps } from '../uom.usecase'

export async function createConversion(
  deps: UomUsecaseDeps,
  req: Entity.CreateUnitConversionReq,
): Promise<Entity.UnitConversion> {
  return deps.repo.createConversion(req)
}
