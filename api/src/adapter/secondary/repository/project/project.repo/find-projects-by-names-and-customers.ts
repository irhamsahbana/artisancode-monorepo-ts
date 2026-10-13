import { and, eq, isNull, or, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { projects } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import { ProjectRepoDeps } from '../project.repo'

export async function findProjectsByNamesAndCustomers(
  deps: ProjectRepoDeps,
  items: { customerId: string; name: string }[],
): Promise<Entity.Project[]> {
  if (items.length === 0) return []

  const conditions = items
    .filter((item) => item.customerId && item.name.trim())
    .map((item) =>
      and(
        eq(projects.customerId, item.customerId),
        sql`lower(trim(${projects.name})) = ${item.name.trim().toLowerCase()}`,
      ),
    )

  if (conditions.length === 0) return []

  const rows = await getExecutor()
    .select()
    .from(projects)
    .where(and(isNull(projects.deletedAt), or(...conditions)))

  return rows.map(deps.toEntity)
}
