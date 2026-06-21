import * as Entity from '@/entities/master.entity'

import { MasterUsecaseDeps } from '../master.usecase'

export async function findMasterItemList(
  deps: MasterUsecaseDeps,
  req: Entity.GetMasterItemReq,
): Promise<Entity.MasterItemList> {
  return deps.repo.findList(req)
}
