import { desc, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { broadcastTemplates } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'

import type { BroadcastRepoDeps } from '../broadcast.repo'

export async function findBroadcastTemplateList(
  deps: BroadcastRepoDeps,
  page: number,
  perPage: number,
): Promise<Entity.BroadcastList> {
  const exec = getExecutor()
  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(broadcastTemplates)
      .where(isNull(broadcastTemplates.deletedAt))
      .orderBy(desc(broadcastTemplates.createdAt))
      .limit(perPage)
      .offset((page - 1) * perPage),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(broadcastTemplates)
      .where(isNull(broadcastTemplates.deletedAt)),
  ])

  const total = countResult[0]?.count ?? 0
  return {
    items: items.map(deps.templateToEntity),
    pagination: { total, page, per_page: perPage, last_page: Math.ceil(total / perPage) },
  }
}
