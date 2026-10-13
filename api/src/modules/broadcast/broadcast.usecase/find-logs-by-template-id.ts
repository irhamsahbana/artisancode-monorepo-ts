import * as Entity from '@/entities/broadcast.entity'

import type { BroadcastUsecaseDeps } from '../broadcast.usecase'

export async function findBroadcastLogsByTemplateId(
  deps: BroadcastUsecaseDeps,
  templateId: string,
): Promise<Entity.BroadcastLog[]> {
  return deps.repo.findLogsByTemplateId(templateId)
}
