import {
  registerWhatsAppWorker,
  stopWhatsAppWorker,
} from '@/adapter/primary/queue/whatsapp-send.worker'
import { closeWhatsAppQueue } from '@/adapter/secondary/queue/whatsapp-send.queue'
import { createBirthdayGreetingRepo } from '@/adapter/secondary/repository/birthday_greeting/birthday_greeting.repo'
import { createBroadcastRepo } from '@/adapter/secondary/repository/broadcast/broadcast.repo'
import { disconnect } from '@/common/db'
import { processBirthdayGreeting } from '@/modules/birthday_greeting/birthday_greeting.processor'
import { processBroadcastSend } from '@/modules/broadcast/broadcast.processor'

async function runWorker(): Promise<void> {
  await registerWhatsAppWorker((data) => {
    switch (data.kind) {
      case 'broadcast':
        return processBroadcastSend(data, createBroadcastRepo())
      case 'birthday-greeting':
        return processBirthdayGreeting(data, createBirthdayGreetingRepo())
    }
  })

  const shutdown = async () => {
    await stopWhatsAppWorker()
    await closeWhatsAppQueue()
    await disconnect()
    process.exit(0)
  }
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
  process.once('SIGUSR2', shutdown)

  // Keep process alive; worker connections hold the event loop
  setInterval(() => undefined, 1 << 30)
}

export default runWorker
