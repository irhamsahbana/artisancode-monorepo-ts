import * as Entity from '@/entities/project.entity'

import { ProjectUsecaseDeps } from '../project.usecase'

export async function findProjectList(
  deps: ProjectUsecaseDeps,
  req: Entity.GetProjectReq,
): Promise<Entity.ProjectList> {
  return deps.repo.findList(req)
}
