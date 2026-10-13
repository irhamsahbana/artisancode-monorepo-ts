import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IBusinessProfileUsecase } from '@/contracts/business_profile.contract'

import { findBusinessProfileHandler as makeFind } from './find'
import { updateBusinessProfileHandler as makeUpdate } from './update'

export function createBusinessProfileHandlerDeps(usecase: IBusinessProfileUsecase) {
  const handlers = {
    find: makeFind(usecase),
    update: makeUpdate(usecase),
  }

  return {
    find: (c: Context<AppEnv>) => withSpan('BusinessProfileHandler.find', () => handlers.find(c)),
    update: (c: Context<AppEnv>) =>
      withSpan('BusinessProfileHandler.update', () => handlers.update(c)),
  }
}

export { createBusinessProfileHandlerDeps as createBusinessProfileHandler }
export default createBusinessProfileHandlerDeps
