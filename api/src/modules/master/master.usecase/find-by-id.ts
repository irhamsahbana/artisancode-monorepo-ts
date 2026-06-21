import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/master.entity'

import { MasterUsecaseDeps } from '../master.usecase'

export async function findMasterItemById(
  deps: MasterUsecaseDeps,
  id: string,
  companyId: string,
): Promise<Entity.MasterItem | null> {
  const item = await deps.repo.findById(id, companyId)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Item not found')
  return item
}
