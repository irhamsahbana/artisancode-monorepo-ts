import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IBusinessProfileUsecase } from '@/contracts/business_profile.contract'

import { getBusinessProfileBrandingHandler as makeBranding } from './branding'
import { deleteBusinessProfileIconHandler as makeDeleteIcon } from './delete-icon'
import { findBusinessProfileHandler as makeFind } from './find'
import { updateBusinessProfileHandler as makeUpdate } from './update'
import { uploadBusinessProfileIconHandler as makeUploadIcon } from './upload-icon'

export function createBusinessProfileHandlerDeps(usecase: IBusinessProfileUsecase) {
  const handlers = {
    find: makeFind(usecase),
    update: makeUpdate(usecase),
    uploadIcon: makeUploadIcon(usecase),
    deleteIcon: makeDeleteIcon(usecase),
    branding: makeBranding(usecase),
  }

  return {
    find: (c: Context<AppEnv>) => withSpan('BusinessProfileHandler.find', () => handlers.find(c)),
    update: (c: Context<AppEnv>) => withSpan('BusinessProfileHandler.update', () => handlers.update(c)),
    uploadIcon: (c: Context<AppEnv>) =>
      withSpan('BusinessProfileHandler.uploadIcon', () => handlers.uploadIcon(c)),
    deleteIcon: (c: Context<AppEnv>) =>
      withSpan('BusinessProfileHandler.deleteIcon', () => handlers.deleteIcon(c)),
    branding: (c: Context<AppEnv>) =>
      withSpan('BusinessProfileHandler.branding', () => handlers.branding(c)),
  }
}

export { createBusinessProfileHandlerDeps as createBusinessProfileHandler }
export default createBusinessProfileHandlerDeps
