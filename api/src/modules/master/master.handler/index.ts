import { IMasterUsecase } from '@/contracts/master.contract'

import { createMasterItemHandler } from './create'
import { deleteMasterItemHandler } from './delete'
import { findMasterItemByIdHandler } from './find-by-id'
import { findMasterItemListHandler } from './find-list'
import { updateMasterItemHandler } from './update'

export function createMasterHandlerDeps(usecase: IMasterUsecase) {
  return {
    create: createMasterItemHandler(usecase),
    findById: findMasterItemByIdHandler(usecase),
    findList: findMasterItemListHandler(usecase),
    update: updateMasterItemHandler(usecase),
    delete: deleteMasterItemHandler(usecase),
  }
}
