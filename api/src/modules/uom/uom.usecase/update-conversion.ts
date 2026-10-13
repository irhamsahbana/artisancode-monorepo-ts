import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/uom.entity'

import type { UomUsecaseDeps } from '../uom.usecase'

export async function updateConversion(
  deps: UomUsecaseDeps,
  req: Entity.UpdateUnitConversionReq,
): Promise<Entity.UnitConversion> {
  const item = await deps.repo.updateConversion(req)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Unit conversion not found')
  return item
}
