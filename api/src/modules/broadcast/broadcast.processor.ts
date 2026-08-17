import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { WhatsAppSendJobData } from '@/common/queue/whatsapp-send.queue'
import { env } from '@/config/env'
import logger from '@/config/logger'
import { IBroadcastRepo } from '@/contracts/broadcast.contract'
import { contacts, customers } from '@/db/schema'
import * as Entity from '@/entities/broadcast.entity'
import { getWhatsAppProvider } from '@/integrations/whatsapp'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * BullMQ worker body: sends a broadcast template to its audience sequentially
 * with throttling, then records per-contact results.
 */
export async function processWhatsAppSend(
  data: WhatsAppSendJobData,
  repo: IBroadcastRepo,
): Promise<void> {
  const exec = getExecutor()
  const template = await exec.query.broadcastTemplates.findFirst({
    where: (t, { eq, and, isNull }) => and(eq(t.id, data.templateId), isNull(t.deletedAt)),
  })

  if (!template) {
    logger.warn('Broadcast template gone, skipping job', { templateId: data.templateId })
    return
  }
  if (template.status === 'sent') {
    // Already sent (e.g. job retried after recordSend succeeded)
    return
  }

  const conditions = [isNull(contacts.deletedAt), isNull(customers.deletedAt)]

  if (template.audienceGender) {
    conditions.push(eq(customers.gender, template.audienceGender))
  }
  if (template.audienceReligion) {
    conditions.push(eq(customers.religion, template.audienceReligion))
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
      contactName: contacts.name,
      whatsapp: contacts.whatsapp,
    })
    .from(contacts)
    .innerJoin(customers, eq(contacts.customerId, customers.id))
    .where(and(...conditions))

  const provider = getWhatsAppProvider()
  const { SEND_DELAY_MIN_MS, SEND_DELAY_MAX_MS } = env.WHATSAPP
  const randomDelayMs = () =>
    SEND_DELAY_MIN_MS + Math.random() * (SEND_DELAY_MAX_MS - SEND_DELAY_MIN_MS)

  const recipientLogs: Entity.PerContactLog[] = []
  for (const contact of targetContacts) {
    if (!contact.whatsapp) {
      recipientLogs.push({
        contactId: contact.contactId,
        contactName: contact.contactName,
        status: 'failed',
        errorMessage: 'Missing WhatsApp number',
      })
      continue
    }

    try {
      await provider.sendTextMessage({ to: contact.whatsapp, message: template.message })
      recipientLogs.push({
        contactId: contact.contactId,
        contactName: contact.contactName,
        status: 'sent',
        sentAt: new Date().toISOString(),
      })
    } catch (error) {
      recipientLogs.push({
        contactId: contact.contactId,
        contactName: contact.contactName,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // Randomized throttle to reduce ban risk on unofficial API
    await sleep(randomDelayMs())
  }

  await repo.recordSend(data.templateId, recipientLogs)
}
