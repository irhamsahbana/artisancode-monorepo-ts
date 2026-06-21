import { getExecutor } from '@/common/executor'
import { masterItems } from '@/db/schema'
import * as Entity from '@/entities/master.entity'

import { MasterRepoDeps } from '../master.repo'

export async function createMasterItem(
  deps: MasterRepoDeps,
  req: Entity.CreateMasterItemReq,
): Promise<Entity.MasterItem> {
  const [row] = await getExecutor()
    .insert(masterItems)
    .values({
      companyId: req.company_id,
      type: req.type,
      name: req.name,
    })
    .returning()
  return deps.toEntity(row)
}
