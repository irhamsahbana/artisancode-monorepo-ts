import { IBusinessProfileRepo } from '@/contracts/business_profile.contract'
import { businessProfiles } from '@/db/schema'
import * as Entity from '@/entities/business_profile.entity'

import { findBusinessProfile } from './business_profile.repo/find'
import { updateBusinessProfile } from './business_profile.repo/update'

export interface BusinessProfileRepoDeps {
  toEntity: (data: typeof businessProfiles.$inferSelect) => Entity.BusinessProfile
}

function toEntity(data: typeof businessProfiles.$inferSelect): Entity.BusinessProfile {
  return {
    id: data.id,
    name: data.name,
    businessType: data.businessType,
    phone: data.phone,
    countryCode: data.countryCode,
    email: data.email,
    address: data.address,
    whatsappDeviceId: data.whatsappDeviceId,
    iconFilename: data.iconFilename,
  }
}

export function createBusinessProfileRepo(): IBusinessProfileRepo {
  const deps: BusinessProfileRepoDeps = { toEntity }

  return {
    find: () => findBusinessProfile(deps),
    update: (req) => updateBusinessProfile(deps, req),
  }
}

export default createBusinessProfileRepo
