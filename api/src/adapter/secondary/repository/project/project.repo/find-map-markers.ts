import { and, isNotNull, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { projects } from '@/db/schema'
import * as Entity from '@/entities/project.entity'

import type { ProjectRepoDeps } from '../project.repo'

export async function findProjectMapMarkers(
  _deps: ProjectRepoDeps,
): Promise<Entity.ProjectMapMarker[]> {
  const rows = await getExecutor()
    .select({
      id: projects.id,
      name: projects.name,
      status: projects.status,
      location: projects.location,
      estimatedValue: projects.estimatedValue,
      latitude: projects.latitude,
      longitude: projects.longitude,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(
      and(isNull(projects.deletedAt), isNotNull(projects.latitude), isNotNull(projects.longitude)),
    )
    .orderBy(sql`${projects.createdAt} desc`)

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    location: row.location,
    estimatedValue: row.estimatedValue ? Number(row.estimatedValue) : null,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    createdAt: row.createdAt,
  }))
}
