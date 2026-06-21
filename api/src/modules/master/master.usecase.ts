import { IMasterRepo, IMasterUsecase } from '@/contracts/master.contract'

import { createMasterItem } from './master.usecase/create'
import { deleteMasterItem } from './master.usecase/delete'
import { findMasterItemById } from './master.usecase/find-by-id'
import { findMasterItemList } from './master.usecase/find-list'
import { updateMasterItem } from './master.usecase/update'

export interface MasterUsecaseDeps {
  repo: IMasterRepo
}

export function createMasterUsecase(repo: IMasterRepo): IMasterUsecase {
  const deps: MasterUsecaseDeps = { repo }

  return {
    create: (req) => createMasterItem(deps, req),
    findById: (id, companyId) => findMasterItemById(deps, id, companyId),
    findList: (req) => findMasterItemList(deps, req),
    update: (req) => updateMasterItem(deps, req),
    delete: (id, companyId) => deleteMasterItem(deps, id, companyId),
  }
}
