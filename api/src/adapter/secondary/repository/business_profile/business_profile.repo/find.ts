import { isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { businessProfiles } from '@/db/schema'
import * as Entity from '@/entities/business_profile.entity'

import type { BusinessProfileRepoDeps } from '../business_profile.repo'

export async function findBusinessProfile(
  deps: BusinessProfileRepoDeps,
): Promise<Entity.BusinessProfile | null> {
  const [row] = await getExecutor()
    .select()
    .from(businessProfiles)
    .where(isNull(businessProfiles.deletedAt))
    .limit(1)
  return row ? deps.toEntity(row) : null
}
