import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/project.entity'

import { ProjectUsecaseDeps } from '../project.usecase'

export async function createVisit(
  deps: ProjectUsecaseDeps,
  req: Entity.CreateProjectVisitReq,
): Promise<Entity.ProjectVisit> {
  const project = await deps.repo.findById(req.projectId)
  if (!project) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
  return deps.repo.createVisit(req)
}
