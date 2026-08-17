import { Worker, createPostgresBackend, PostgresQueueBackend } from 'bullmq'

import {
  WHATSAPP_SEND_QUEUE,
  WhatsAppSendJobData,
  whatsappQueueConnection,
  ensureWhatsAppQueueSchema,
} from '@/common/queue/whatsapp-send.queue'
import logger from '@/config/logger'

type WhatsAppWorker = Worker<WhatsAppSendJobData, void, string, PostgresQueueBackend>

/** Register the worker that processes WhatsApp send jobs. Call once at bootstrap. */
export async function startWhatsAppWorker(
  processJob: (data: WhatsAppSendJobData) => Promise<void>,
): Promise<WhatsAppWorker> {
  await ensureWhatsAppQueueSchema()
  const worker = new Worker<WhatsAppSendJobData, void, string, PostgresQueueBackend>(
    WHATSAPP_SEND_QUEUE,
    async (job) => processJob(job.data),
    { connection: whatsappQueueConnection, concurrency: 1 },
    createPostgresBackend,
  )

  worker.on('failed', (job, err) => {
    // Per-contact failures are recorded in broadcast_logs; reaching here means
    // the job itself blew up (e.g. DB down) after all retries
    if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
      logger.error('WhatsApp send job failed permanently', { jobId: job.id, err: err.message })
    }
  })

  logger.info('WhatsApp send worker started')
  return worker
}

let workerRef: WhatsAppWorker | null = null
export async function registerWhatsAppWorker(
  processJob: (data: WhatsAppSendJobData) => Promise<void>,
): Promise<void> {
  workerRef = await startWhatsAppWorker(processJob)
}

/** Stop this process's worker on shutdown. Does not touch the producer-side queue — see closeWhatsAppQueue. */
export async function stopWhatsAppWorker(): Promise<void> {
  await workerRef?.close()
  workerRef = null
}
