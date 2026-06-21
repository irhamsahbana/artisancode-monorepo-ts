import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { masterItems } from '@/db/schema'
import * as Entity from '@/entities/master.entity'

import { MasterRepoDeps } from '../master.repo'

export async function updateMasterItem(
  deps: MasterRepoDeps,
  req: Entity.UpdateMasterItemReq,
): Promise<Entity.MasterItem | null> {
  const updates: Partial<typeof masterItems.$inferInsert> = {
    updatedAt: sql`now()` as unknown as Date,
  }

  if (req.name !== undefined) updates.name = req.name
  if (req.isActive !== undefined) updates.isActive = req.isActive

  const [row] = await getExecutor()
    .update(masterItems)
    .set(updates)
    .where(
      and(
        eq(masterItems.id, req.id),
        eq(masterItems.companyId, req.company_id),
        isNull(masterItems.deletedAt),
      ),
    )
    .returning()

  return row ? deps.toEntity(row) : null
}
