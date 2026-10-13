import * as Entity from '@/entities/uom.entity'

import type { UomUsecaseDeps } from '../uom.usecase'

export async function createUom(
  deps: UomUsecaseDeps,
  req: Entity.CreateUomReq,
): Promise<Entity.UnitOfMeasurement> {
  return deps.repo.createUom(req)
}
