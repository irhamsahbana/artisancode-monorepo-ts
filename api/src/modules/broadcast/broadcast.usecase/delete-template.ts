import { AppError, ErrorCode } from '@artisancode/types'

import type { BroadcastUsecaseDeps } from '../broadcast.usecase'

export async function deleteBroadcastTemplate(
  deps: BroadcastUsecaseDeps,
  id: string,
): Promise<void> {
  const logCount = await deps.repo.countLogsForTemplate(id)
  if (logCount > 0) {
    throw new AppError(ErrorCode.CONFLICT, `Cannot delete: template has ${logCount} send log(s)`)
  }
  await deps.repo.deleteTemplate(id)
}
