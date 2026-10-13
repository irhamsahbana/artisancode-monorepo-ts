import { desc } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { projectVisits } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import type { ProjectRepoDeps } from '../project.repo'

export async function findAllProjectVisits(deps: ProjectRepoDeps): Promise<Entity.ProjectVisit[]> {
  const rows = await getExecutor()
    .select()
    .from(projectVisits)
    .orderBy(desc(projectVisits.visitDate))
  return rows.map(deps.visitToEntity)
}
