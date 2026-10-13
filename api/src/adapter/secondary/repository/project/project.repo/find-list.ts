import { and, eq, ilike, isNull, or, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { projects } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import type { ProjectRepoDeps } from '../project.repo'

export async function findProjectList(
  deps: ProjectRepoDeps,
  req: Entity.GetProjectReq,
): Promise<Entity.ProjectList> {
  const { pagination = {}, q, status, customerId } = req
  const { page = 1, per_page = 10 } = pagination
  const offset = (page - 1) * per_page

  const conditions = [isNull(projects.deletedAt)]
  if (q) {
    const search = or(
      ilike(projects.name, `%${q}%`),
      ilike(projects.location, `%${q}%`),
      ilike(projects.projectNumber, `%${q}%`),
    )
    if (search) conditions.push(search)
  }
  if (status) conditions.push(eq(projects.status, status))
  if (customerId) conditions.push(eq(projects.customerId, customerId))
  const where = and(...conditions)

  const exec = getExecutor()
  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(projects)
      .where(where)
      .orderBy(sql`${projects.createdAt} desc`)
      .limit(per_page)
      .offset(offset),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(where),
  ])

  const total = countResult[0]?.count ?? 0
  return {
    items: items.map(deps.toEntity),
    pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
  }
}
