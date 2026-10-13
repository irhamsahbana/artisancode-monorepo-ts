import * as Entity from '@/entities/uom.entity'

import type { UomUsecaseDeps } from '../uom.usecase'

export async function findUomList(
  deps: UomUsecaseDeps,
  req: Entity.GetUomReq,
): Promise<Entity.UomList> {
  return deps.repo.findUomList(req)
}
