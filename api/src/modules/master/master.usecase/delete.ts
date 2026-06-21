import { AppError, ErrorCode } from '@artisancode/types'

import { MasterUsecaseDeps } from '../master.usecase'

export async function deleteMasterItem(
  deps: MasterUsecaseDeps,
  id: string,
  companyId: string,
): Promise<void> {
  const item = await deps.repo.findById(id, companyId)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Item not found')
  await deps.repo.delete(id, companyId)
}
