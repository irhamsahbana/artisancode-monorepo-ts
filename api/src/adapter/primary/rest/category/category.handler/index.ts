import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { ICategoryUsecase } from '@/contracts/category.contract'

import { createCategoryHandler as makeCreate } from './create'
import { deleteCategoryHandler as makeDelete } from './delete'
import { findCategoryByIdHandler as makeFindById } from './find-by-id'
import { findCategoryListHandler as makeFindList } from './find-list'
import { updateCategoryHandler as makeUpdate } from './update'

export function createCategoryHandlerDeps(usecase: ICategoryUsecase) {
  const handlers = {
    create: makeCreate(usecase),
    update: makeUpdate(usecase),
    delete: makeDelete(usecase),
    findById: makeFindById(usecase),
    findList: makeFindList(usecase),
  }

  return {
    create: (c: Context<AppEnv>) => withSpan('CategoryHandler.create', () => handlers.create(c)),
    update: (c: Context<AppEnv>) => withSpan('CategoryHandler.update', () => handlers.update(c)),
    delete: (c: Context<AppEnv>) => withSpan('CategoryHandler.delete', () => handlers.delete(c)),
    findById: (c: Context<AppEnv>) =>
      withSpan('CategoryHandler.findById', () => handlers.findById(c)),
    findList: (c: Context<AppEnv>) =>
      withSpan('CategoryHandler.findList', () => handlers.findList(c)),
  }
}

export { createCategoryHandlerDeps as createCategoryHandler }
