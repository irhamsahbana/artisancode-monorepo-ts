import { AppError, ErrorCode } from '@artisancode/types'
import { and, eq, isNull } from 'drizzle-orm'

import { enqueueWhatsAppSend } from '@/adapter/secondary/queue/whatsapp-send.queue'
import { getExecutor } from '@/common/executor'
import { contacts, customers } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

import type { BroadcastUsecaseDeps } from '../broadcast.usecase'

export async function sendBroadcast(
  _deps: BroadcastUsecaseDeps,
  req: Entity.SendBroadcastReq,
): Promise<Entity.SendBroadcastRes> {
  const exec = getExecutor()

  // 1. Fetch template to get audience criteria
  const template = await exec.query.broadcastTemplates.findFirst({
    where: (t, { eq, and, isNull }) => and(eq(t.id, req.templateId), isNull(t.deletedAt)),
  })

  if (!template) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Broadcast template not found')
  }
  if (template.status === 'sent') {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 'Broadcast already sent')
  }

  // 2. Query target audience based on criteria
  const conditions = [isNull(contacts.deletedAt), isNull(customers.deletedAt)]

  if (template.audienceGender) {
    conditions.push(eq(contacts.gender, template.audienceGender))
  }
  if (template.audienceReligion) {
    conditions.push(eq(contacts.religion, template.audienceReligion))
  }
  if (template.audienceSegmentationId) {
    conditions.push(eq(customers.segmentationId, template.audienceSegmentationId))
  }
  if (template.audienceCustomerStatus) {
    conditions.push(
      eq(customers.status, template.audienceCustomerStatus as 'prospect' | 'active' | 'inactive'),
    )
  }

  const targetContacts = await exec
    .select({
      contactId: contacts.id,
    })
    .from(contacts)
    .innerJoin(customers, eq(contacts.customerId, customers.id))
    .where(and(...conditions))

  if (targetContacts.length === 0) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 'No contacts match the audience criteria')
  }

  // 3. Enqueue: singletonKey = templateId dedupes a second send while one is running
  const provider = getWhatsAppProvider()
  await enqueueWhatsAppSend({ kind: 'broadcast', templateId: req.templateId })

  // 4. Ack immediately with dispatch info
  return {
    templateId: req.templateId,
    recipientCount: targetContacts.length,
    provider: provider.name,
  }
}
