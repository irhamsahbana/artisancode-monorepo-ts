import { Queue, createPostgresBackend, PostgresQueueBackend } from 'bullmq'

import {
  WHATSAPP_SEND_QUEUE,
  WhatsAppSendJobData,
  whatsappQueueConnection,
  ensureWhatsAppQueueSchema,
} from '@/common/queue/whatsapp-send.queue'

// Queue's backend type `B` is its 7th generic param; positions 4-6 (DataType/ResultType/NameType)
// must be repeated to reach it since TS generics can't skip a middle default.
type WhatsAppQueue = Queue<
  WhatsAppSendJobData,
  unknown,
  string,
  WhatsAppSendJobData,
  unknown,
  string,
  PostgresQueueBackend
>

let queue: WhatsAppQueue | null = null

function getWhatsAppQueue(): WhatsAppQueue {
  if (!queue) {
    queue = new Queue<
      WhatsAppSendJobData,
      unknown,
      string,
      WhatsAppSendJobData,
      unknown,
      string,
      PostgresQueueBackend
    >(WHATSAPP_SEND_QUEUE, { connection: whatsappQueueConnection }, createPostgresBackend)
  }
  return queue
}

/**
 * Enqueue a broadcast send. jobId dedupes: a second send of the same template
 * while a job is waiting/running is rejected by BullMQ.
 */
export async function enqueueWhatsAppSend(data: WhatsAppSendJobData): Promise<void> {
  // ponytail: migrations run inline once per boot; move to deploy step if boot slows
  await ensureWhatsAppQueueSchema()
  await getWhatsAppQueue().add('broadcast', data, {
    jobId: `broadcast:${data.templateId}`,
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  })
}

/** Close the producer-side queue connection on shutdown. */
export async function closeWhatsAppQueue(): Promise<void> {
  await getWhatsAppQueue().close()
  queue = null
}
