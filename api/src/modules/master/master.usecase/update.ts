import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/master.entity'

import { MasterUsecaseDeps } from '../master.usecase'

export async function updateMasterItem(
  deps: MasterUsecaseDeps,
  req: Entity.UpdateMasterItemReq,
): Promise<Entity.MasterItem | null> {
  const item = await deps.repo.update(req)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Item not found')
  return item
}
