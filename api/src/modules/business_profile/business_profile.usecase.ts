import {
  IBusinessProfileRepo,
  IBusinessProfileUsecase,
} from '@/contracts/business_profile.contract'

import { getBusinessProfileBranding } from './business_profile.usecase/branding'
import { findBusinessProfile } from './business_profile.usecase/find'
import { updateBusinessProfile } from './business_profile.usecase/update'

export interface BusinessProfileUsecaseDeps {
  repo: IBusinessProfileRepo
}

export function createBusinessProfileUsecase(repo: IBusinessProfileRepo): IBusinessProfileUsecase {
  const deps: BusinessProfileUsecaseDeps = { repo }

  return {
    find: () => findBusinessProfile(deps),
    update: (req) => updateBusinessProfile(deps, req),
    branding: () => getBusinessProfileBranding(deps),
  }
}

export default createBusinessProfileUsecase
