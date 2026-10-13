import * as Entity from '@/entities/project.entity'

import { ProjectUsecaseDeps } from '../project.usecase'

export async function findProjectMapMarkers(
  deps: ProjectUsecaseDeps,
): Promise<Entity.ProjectMapMarker[]> {
  return deps.repo.findMapMarkers()
}
