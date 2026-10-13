import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/project.entity'

import { ProjectUsecaseDeps } from '../project.usecase'

export async function findProjectById(
  deps: ProjectUsecaseDeps,
  id: string,
): Promise<Entity.Project> {
  const item = await deps.repo.findById(id)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
  return item
}
