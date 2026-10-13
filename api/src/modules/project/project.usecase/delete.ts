import { AppError, ErrorCode } from '@artisancode/types'

import { ProjectUsecaseDeps } from '../project.usecase'

export async function deleteProject(deps: ProjectUsecaseDeps, id: string): Promise<void> {
  const existing = await deps.repo.findById(id)
  if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
  await deps.repo.delete(id)
}
