import { IMasterRepo } from '@/contracts/master.contract'
import { masterItems } from '@/db/schema'
import * as Entity from '@/entities/master.entity'

import { createMasterItem } from './master.repo/create'
import { deleteMasterItem } from './master.repo/delete'
import { findMasterItemById } from './master.repo/find-by-id'
import { findMasterItemList } from './master.repo/find-list'
import { updateMasterItem } from './master.repo/update'

export interface MasterRepoDeps {
  toEntity: (data: typeof masterItems.$inferSelect) => Entity.MasterItem
}

function toEntity(data: typeof masterItems.$inferSelect): Entity.MasterItem {
  return {
    id: data.id,
    companyId: data.companyId,
    type: data.type,
    name: data.name,
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  }
}

export function createMasterRepo(): IMasterRepo {
  const deps: MasterRepoDeps = { toEntity }

  return {
    create: (req) => createMasterItem(deps, req),
    findById: (id, companyId) => findMasterItemById(deps, id, companyId),
    findList: (req) => findMasterItemList(deps, req),
    update: (req) => updateMasterItem(deps, req),
    delete: (id, companyId) => deleteMasterItem(id, companyId),
  }
}
