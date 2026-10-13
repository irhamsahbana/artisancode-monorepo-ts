import { getExecutor } from '@/common/executor'
import { projectVisits } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import type { ProjectRepoDeps } from '../project.repo'

export async function createProjectVisit(
  deps: ProjectRepoDeps,
  req: Entity.CreateProjectVisitReq,
): Promise<Entity.ProjectVisit> {
  const [row] = await getExecutor()
    .insert(projectVisits)
    .values({
      projectId: req.projectId,
      visitDate: req.visitDate,
      metWith: req.metWith,
      topic: req.topic,
      notes: req.notes,
    })
    .returning()
  return deps.visitToEntity(row)
}
