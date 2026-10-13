import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/business_profile.entity'

import type { BusinessProfileUsecaseDeps } from '../business_profile.usecase'

export async function findBusinessProfile(
  deps: BusinessProfileUsecaseDeps,
): Promise<Entity.BusinessProfile> {
  const item = await deps.repo.find()
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Business profile not found')
  return item
}
