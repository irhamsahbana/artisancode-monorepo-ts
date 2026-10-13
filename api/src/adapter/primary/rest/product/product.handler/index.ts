import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IProductUsecase } from '@/contracts/product.contract'

import { createProductHandler as makeCreate } from './create'
import { deleteProductHandler as makeDelete } from './delete'
import { findProductListHandler as makeFindList } from './find-list'
import { updateProductHandler as makeUpdate } from './update'

export function createProductHandlerDeps(usecase: IProductUsecase) {
  const handlers = {
    create: makeCreate(usecase),
    findList: makeFindList(usecase),
    update: makeUpdate(usecase),
    delete: makeDelete(usecase),
  }

  return {
    create: (c: Context<AppEnv>) => withSpan('ProductHandler.create', () => handlers.create(c)),
    findList: (c: Context<AppEnv>) =>
      withSpan('ProductHandler.findList', () => handlers.findList(c)),
    update: (c: Context<AppEnv>) => withSpan('ProductHandler.update', () => handlers.update(c)),
    delete: (c: Context<AppEnv>) => withSpan('ProductHandler.delete', () => handlers.delete(c)),
  }
}

export { createProductHandlerDeps as createProductHandler }
