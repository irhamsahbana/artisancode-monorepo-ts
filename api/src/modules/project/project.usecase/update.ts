import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/project.entity'

import { ALLOWED_TRANSITIONS, ProjectUsecaseDeps } from '../project.usecase'

export async function updateProject(
  deps: ProjectUsecaseDeps,
  req: Entity.UpdateProjectReq,
): Promise<Entity.Project> {
  const existing = await deps.repo.findById(req.id)
  if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')

  if (req.status && req.status !== existing.status) {
    if (!ALLOWED_TRANSITIONS[existing.status].includes(req.status)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `Invalid status transition: ${existing.status} -> ${req.status}`,
      )
    }
  }

  const item = await deps.repo.update(req)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Project not found')
  return item
}
