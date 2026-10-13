import { IUomRepo, IUomUsecase } from '@/contracts/uom.contract'

import { createConversion } from './uom.usecase/create-conversion'
import { createUom } from './uom.usecase/create-uom'
import { deleteConversion } from './uom.usecase/delete-conversion'
import { deleteUom } from './uom.usecase/delete-uom'
import { findConversionList } from './uom.usecase/find-conversion-list'
import { findUomList } from './uom.usecase/find-uom-list'
import { updateConversion } from './uom.usecase/update-conversion'
import { updateUom } from './uom.usecase/update-uom'

export interface UomUsecaseDeps {
  repo: IUomRepo
}

export function createUomUsecase(repo: IUomRepo): IUomUsecase {
  const deps: UomUsecaseDeps = { repo }

  return {
    createUom: (req) => createUom(deps, req),
    findUomList: (req) => findUomList(deps, req),
    updateUom: (req) => updateUom(deps, req),
    deleteUom: (id) => deleteUom(deps, id),
    createConversion: (req) => createConversion(deps, req),
    findConversionList: (req) => findConversionList(deps, req),
    updateConversion: (req) => updateConversion(deps, req),
    deleteConversion: (id) => deleteConversion(deps, id),
  }
}

export default createUomUsecase
