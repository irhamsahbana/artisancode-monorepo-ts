import { getExecutor } from '@/common/executor'
import { broadcastTemplates } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'

import type { BroadcastRepoDeps } from '../broadcast.repo'

export async function createBroadcastTemplate(
  deps: BroadcastRepoDeps,
  req: Entity.CreateBroadcastTemplateReq,
): Promise<Entity.BroadcastTemplate> {
  const [row] = await getExecutor()
    .insert(broadcastTemplates)
    .values({
      name: req.name,
      message: req.message,
      occasion: req.occasion,
      audienceGender: req.audienceGender,
      audienceReligion: req.audienceReligion,
      audienceSegmentationId: req.audienceSegmentationId,
      audienceCustomerStatus: req.audienceCustomerStatus,
      scheduledAt: req.scheduledAt ? new Date(req.scheduledAt) : null,
      status: req.scheduledAt ? 'scheduled' : 'draft',
    })
    .returning()
  return deps.templateToEntity(row)
}
