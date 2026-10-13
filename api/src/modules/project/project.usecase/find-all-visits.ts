import * as Entity from '@/entities/project.entity'

import { ProjectUsecaseDeps } from '../project.usecase'

export async function findAllVisits(deps: ProjectUsecaseDeps): Promise<Entity.ProjectVisit[]> {
  return deps.repo.findAllVisits()
}
