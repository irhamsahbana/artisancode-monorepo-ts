import { and, inArray, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { projects } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import { ProjectRepoDeps } from '../project.repo'

export async function findProjectsByNumbers(
  deps: ProjectRepoDeps,
  numbers: string[],
): Promise<Entity.Project[]> {
  if (numbers.length === 0) return []

  const cleanNumbers = numbers.map((n) => n.trim().toLowerCase()).filter(Boolean)
  if (cleanNumbers.length === 0) return []

  const rows = await getExecutor()
    .select()
    .from(projects)
    .where(
      and(
        isNull(projects.deletedAt),
        inArray(sql`lower(trim(${projects.projectNumber}))`, cleanNumbers),
      ),
    )

  return rows.map(deps.toEntity)
}
