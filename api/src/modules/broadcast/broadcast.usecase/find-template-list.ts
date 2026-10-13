import * as Entity from '@/entities/broadcast.entity'

import type { BroadcastUsecaseDeps } from '../broadcast.usecase'

export async function findBroadcastTemplateList(
  deps: BroadcastUsecaseDeps,
  page: number,
  perPage: number,
): Promise<Entity.BroadcastList> {
  return deps.repo.findTemplateList(page, perPage)
}
