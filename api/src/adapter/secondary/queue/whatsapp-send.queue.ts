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
 * Enqueue a WhatsApp send job. jobId dedupes: a second job with the same id
 * while one is waiting/running/completed is rejected by BullMQ.
 * - broadcast: keyed by templateId — a second "send now" click on the same
 *   campaign while a send is in flight is dropped.
 * - birthday-greeting: keyed by today's date — the scheduler fires this once
 *   a day, so each day needs a fresh id (a bare constant id would collide
 *   with yesterday's already-completed job and silently no-op).
 */
export async function enqueueWhatsAppSend(data: WhatsAppSendJobData): Promise<void> {
  // ponytail: migrations run inline once per boot; move to deploy step if boot slows
  await ensureWhatsAppQueueSchema()
  const jobId =
    data.kind === 'broadcast'
      ? `broadcast:${data.templateId}`
      : `birthday-greeting:${new Date().toISOString().slice(0, 10)}`
  await getWhatsAppQueue().add(data.kind, data, {
    jobId,
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
