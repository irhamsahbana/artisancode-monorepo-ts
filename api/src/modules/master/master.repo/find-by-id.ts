import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { masterItems } from '@/db/schema'
import * as Entity from '@/entities/master.entity'

import { MasterRepoDeps } from '../master.repo'

export async function findMasterItemById(
  deps: MasterRepoDeps,
  id: string,
  companyId: string,
): Promise<Entity.MasterItem | null> {
  const [row] = await getExecutor()
    .select()
    .from(masterItems)
    .where(
      and(
        eq(masterItems.id, id),
        eq(masterItems.companyId, companyId),
        isNull(masterItems.deletedAt),
      ),
    )
    .limit(1)
  return row ? deps.toEntity(row) : null
}
