import * as Entity from '@/entities/project.entity'

import { ProjectUsecaseDeps } from '../project.usecase'

export async function createProject(
  deps: ProjectUsecaseDeps,
  req: Entity.CreateProjectReq,
): Promise<Entity.Project> {
  return deps.repo.create(req)
}
