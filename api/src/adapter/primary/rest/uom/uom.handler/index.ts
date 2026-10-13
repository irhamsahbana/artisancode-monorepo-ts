import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IUomUsecase } from '@/contracts/uom.contract'

import { createConversionHandler as makeCreateConversion } from './create-conversion'
import { createUomHandler as makeCreateUom } from './create-uom'
import { deleteConversionHandler as makeDeleteConversion } from './delete-conversion'
import { deleteUomHandler as makeDeleteUom } from './delete-uom'
import { findConversionListHandler as makeFindConversionList } from './find-conversion-list'
import { findUomListHandler as makeFindUomList } from './find-uom-list'
import { updateConversionHandler as makeUpdateConversion } from './update-conversion'
import { updateUomHandler as makeUpdateUom } from './update-uom'

export function createUomHandlerDeps(usecase: IUomUsecase) {
  const handlers = {
    createUom: makeCreateUom(usecase),
    findUomList: makeFindUomList(usecase),
    updateUom: makeUpdateUom(usecase),
    deleteUom: makeDeleteUom(usecase),
    createConversion: makeCreateConversion(usecase),
    findConversionList: makeFindConversionList(usecase),
    updateConversion: makeUpdateConversion(usecase),
    deleteConversion: makeDeleteConversion(usecase),
  }

  return {
    createUom: (c: Context<AppEnv>) => withSpan('UomHandler.createUom', () => handlers.createUom(c)),
    findUomList: (c: Context<AppEnv>) => withSpan('UomHandler.findUomList', () => handlers.findUomList(c)),
    updateUom: (c: Context<AppEnv>) => withSpan('UomHandler.updateUom', () => handlers.updateUom(c)),
    deleteUom: (c: Context<AppEnv>) => withSpan('UomHandler.deleteUom', () => handlers.deleteUom(c)),
    createConversion: (c: Context<AppEnv>) => withSpan('UomHandler.createConversion', () => handlers.createConversion(c)),
    findConversionList: (c: Context<AppEnv>) =>
      withSpan('UomHandler.findConversionList', () => handlers.findConversionList(c)),
    updateConversion: (c: Context<AppEnv>) =>
      withSpan('UomHandler.updateConversion', () => handlers.updateConversion(c)),
    deleteConversion: (c: Context<AppEnv>) =>
      withSpan('UomHandler.deleteConversion', () => handlers.deleteConversion(c)),
  }
}

export { createUomHandlerDeps as createUomHandler }
