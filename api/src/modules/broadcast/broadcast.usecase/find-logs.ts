import * as Entity from '@/entities/broadcast.entity'

import type { BroadcastUsecaseDeps } from '../broadcast.usecase'

export async function findBroadcastLogs(
  deps: BroadcastUsecaseDeps,
): Promise<Entity.BroadcastLog[]> {
  return deps.repo.findLogs()
}
