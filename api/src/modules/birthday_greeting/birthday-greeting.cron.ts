import { and, eq, isNotNull, isNull } from 'drizzle-orm'

import { enqueueWhatsAppSend } from '@/adapter/secondary/queue/whatsapp-send.queue'
import { createBirthdayGreetingRepo } from '@/adapter/secondary/repository/birthday_greeting/birthday_greeting.repo'
import { getExecutor } from '@/common/executor'
import logger from '@/config/logger'
import { contacts, customers } from '@/db/schema'

/**
 * Run once daily (triggered by jobs/scheduler.ts): if birthday greetings are
 * enabled, match contacts whose customer's birthday is today against the
 * settings' audience filters, and enqueue one WhatsApp send job with an
 * explicit recipient list. dateOfBirth is stored as free-form text (expected
 * "YYYY-MM-DD"), so the MM-DD match happens in JS rather than SQL.
 */
export async function runBirthdayGreetingCron(): Promise<void> {
  const settings = await createBirthdayGreetingRepo().find()

  if (!settings || !settings.enabled) {
    logger.info('Birthday greeting disabled or not configured, skipping', { label: 'CRON' })
    return
  }

  const conditions = [
    isNull(contacts.deletedAt),
    isNull(customers.deletedAt),
    isNotNull(customers.dateOfBirth),
  ]

  if (settings.audienceGender) {
    conditions.push(eq(customers.gender, settings.audienceGender))
  }
  if (settings.audienceReligion) {
    conditions.push(eq(customers.religion, settings.audienceReligion))
  }
  if (settings.audienceSegmentationId) {
    conditions.push(eq(customers.segmentationId, settings.audienceSegmentationId))
  }
  if (settings.audienceCustomerStatus) {
    conditions.push(
      eq(customers.status, settings.audienceCustomerStatus as 'prospect' | 'active' | 'inactive'),
    )
  }

  const candidates = await getExecutor()
    .select({
      contactId: contacts.id,
      contactName: contacts.name,
      whatsapp: contacts.whatsapp,
      dateOfBirth: customers.dateOfBirth,
      gender: customers.gender,
    })
    .from(contacts)
    .innerJoin(customers, eq(contacts.customerId, customers.id))
    .where(and(...conditions))

  const todayMMDD = new Date().toISOString().slice(5, 10)
  const recipients: {
    contactId: string
    contactName: string
    whatsapp: string
    gender?: 'male' | 'female'
  }[] = []
  for (const c of candidates) {
    if (c.whatsapp && c.dateOfBirth?.slice(5, 10) === todayMMDD) {
      recipients.push({
        contactId: c.contactId,
        contactName: c.contactName,
        whatsapp: c.whatsapp,
        gender: c.gender ?? undefined,
      })
    }
  }

  if (recipients.length === 0) {
    logger.info('No birthdays today matching audience filters', { label: 'CRON' })
    return
  }

  await enqueueWhatsAppSend({ kind: 'birthday-greeting', message: settings.message, recipients })
  logger.info('Enqueued birthday greeting', { label: 'CRON', data: { count: recipients.length } })
}
