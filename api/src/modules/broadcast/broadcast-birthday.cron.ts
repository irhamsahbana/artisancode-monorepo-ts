import { and, eq, isNotNull, isNull } from 'drizzle-orm'

import { enqueueWhatsAppSend } from '@/adapter/secondary/queue/whatsapp-send.queue'
import { getExecutor } from '@/common/executor'
import logger from '@/config/logger'
import { contacts, customers } from '@/db/schema'

/**
 * Run once daily (triggered by an external scheduler): find every active
 * "birthday" broadcast template, match it against contacts whose customer's
 * birthday is today, and enqueue one WhatsApp send job per template with an
 * explicit recipient list. dateOfBirth is stored as free-form text (expected
 * "YYYY-MM-DD"), so the MM-DD match happens in JS rather than SQL.
 */
export async function runBirthdayBroadcast(): Promise<void> {
  const exec = getExecutor()

  const templates = await exec.query.broadcastTemplates.findMany({
    where: (t, { eq, and, isNull }) => and(eq(t.occasion, 'birthday'), isNull(t.deletedAt)),
  })

  if (templates.length === 0) {
    logger.info('No active birthday templates, skipping', { label: 'CRON' })
    return
  }

  const todayMMDD = new Date().toISOString().slice(5, 10)

  for (const template of templates) {
    const conditions = [
      isNull(contacts.deletedAt),
      isNull(customers.deletedAt),
      isNotNull(customers.dateOfBirth),
    ]

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

    const candidates = await exec
      .select({
        contactId: contacts.id,
        contactName: contacts.name,
        whatsapp: contacts.whatsapp,
        dateOfBirth: customers.dateOfBirth,
      })
      .from(contacts)
      .innerJoin(customers, eq(contacts.customerId, customers.id))
      .where(and(...conditions))

    const recipients: { contactId: string; contactName: string; whatsapp: string }[] = []
    for (const c of candidates) {
      if (c.whatsapp && c.dateOfBirth?.slice(5, 10) === todayMMDD) {
        recipients.push({
          contactId: c.contactId,
          contactName: c.contactName,
          whatsapp: c.whatsapp,
        })
      }
    }

    if (recipients.length === 0) continue

    await enqueueWhatsAppSend({ templateId: template.id, recipients })
    logger.info('Enqueued birthday broadcast', {
      label: 'CRON',
      data: { templateId: template.id, count: recipients.length },
    })
  }
}
