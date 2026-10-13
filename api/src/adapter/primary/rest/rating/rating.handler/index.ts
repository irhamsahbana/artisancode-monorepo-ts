import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IRatingUsecase } from '@/contracts/rating.contract'

import { createRatingHandler as makeCreate } from './create'
import { findRatingListHandler as makeFindList } from './find-list'

export function createRatingHandlerDeps(usecase: IRatingUsecase) {
  const handlers = {
    create: makeCreate(usecase),
    findList: makeFindList(usecase),
  }

  return {
    create: (c: Context<AppEnv>) => withSpan('RatingHandler.create', () => handlers.create(c)),
    findList: (c: Context<AppEnv>) => withSpan('RatingHandler.findList', () => handlers.findList(c)),
  }
}

export { createRatingHandlerDeps as createRatingHandler }
