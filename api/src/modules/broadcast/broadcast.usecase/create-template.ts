import * as Entity from '@/entities/broadcast.entity'

import type { BroadcastUsecaseDeps } from '../broadcast.usecase'

export async function createBroadcastTemplate(
  deps: BroadcastUsecaseDeps,
  req: Entity.CreateBroadcastTemplateReq,
): Promise<Entity.BroadcastTemplate> {
  return deps.repo.createTemplate(req)
}
