import { AppError, ErrorCode } from '@artisancode/types'

import { UomUsecaseDeps } from '../uom.usecase'

export async function deleteUom(deps: UomUsecaseDeps, id: string): Promise<void> {
  const conversionCount = await deps.repo.countConversionsForUom(id)
  if (conversionCount > 0) {
    throw new AppError(
      ErrorCode.CONFLICT,
      `Cannot delete: still used by ${conversionCount} unit conversion(s)`,
    )
  }
  await deps.repo.deleteUom(id)
}
