import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { projects } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import type { ProjectRepoDeps } from '../project.repo'

export async function findProjectById(
  deps: ProjectRepoDeps,
  id: string,
): Promise<Entity.Project | null> {
  const [row] = await getExecutor()
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
    .limit(1)
  return row ? deps.toEntity(row) : null
}
