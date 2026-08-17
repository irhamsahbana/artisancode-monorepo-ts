import { WhatsAppSendJobData } from '@/common/queue/whatsapp-send.queue'
import { env } from '@/config/env'
import { IBirthdayGreetingRepo } from '@/contracts/birthday_greeting.contract'
import * as Entity from '@/entities/birthday_greeting.entity'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type BirthdayGreetingJobData = Extract<WhatsAppSendJobData, { kind: 'birthday-greeting' }>

/**
 * BullMQ worker body: sends the birthday greeting to today's already-resolved
 * recipient list sequentially with throttling, then records the results.
 */
export async function processBirthdayGreeting(
  data: BirthdayGreetingJobData,
  repo: IBirthdayGreetingRepo,
): Promise<void> {
  const provider = getWhatsAppProvider()
  const { SEND_DELAY_MIN_MS, SEND_DELAY_MAX_MS } = env.WHATSAPP
  const randomDelayMs = () =>
    SEND_DELAY_MIN_MS + Math.random() * (SEND_DELAY_MAX_MS - SEND_DELAY_MIN_MS)

  const recipientLogs: Entity.BirthdayGreetingRecipientLog[] = []
  for (const contact of data.recipients) {
    const sapaan = contact.gender === 'female' ? 'Ibu' : 'Bapak'
    const message = data.message
      .replace(/\{\{\s*nama\s*\}\}/gi, contact.contactName)
      .replace(/\{\{\s*sapaan\s*\}\}/gi, sapaan)

    try {
      await provider.sendTextMessage({ to: contact.whatsapp, message })
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

  await repo.recordSend(recipientLogs)
}
