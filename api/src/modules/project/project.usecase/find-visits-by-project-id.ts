import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/project.entity'

import { ProjectUsecaseDeps } from '../project.usecase'

export async function findVisitsByProjectId(
  deps: ProjectUsecaseDeps,
  projectId: string,
): Promise<Entity.ProjectVisit[]> {
  const project = await deps.repo.findById(projectId)
  if (!project) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
  return deps.repo.findVisitsByProjectId(projectId)
}
