import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/uom.entity'

import type { UomUsecaseDeps } from '../uom.usecase'

export async function updateUom(
  deps: UomUsecaseDeps,
  req: Entity.UpdateUomReq,
): Promise<Entity.UnitOfMeasurement> {
  const item = await deps.repo.updateUom(req)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'UoM not found')
  return item
}
