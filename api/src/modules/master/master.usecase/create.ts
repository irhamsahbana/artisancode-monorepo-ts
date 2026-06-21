import * as Entity from '@/entities/master.entity'

import { MasterUsecaseDeps } from '../master.usecase'

export async function createMasterItem(
  deps: MasterUsecaseDeps,
  req: Entity.CreateMasterItemReq,
): Promise<Entity.MasterItem> {
  return deps.repo.create(req)
}
