import * as Entity from '@/entities/business_profile.entity'

import type { BusinessProfileUsecaseDeps } from '../business_profile.usecase'

export async function getBusinessProfileBranding(
  deps: BusinessProfileUsecaseDeps,
): Promise<Entity.BusinessBranding> {
  const item = await deps.repo.find()
  return { name: item?.name || 'CRM App' }
}
