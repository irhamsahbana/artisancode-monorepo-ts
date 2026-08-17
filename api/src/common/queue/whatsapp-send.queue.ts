import { runMigrations } from 'bullmq'
import { Pool } from 'pg'

import { env } from '@/config/env'

export const WHATSAPP_SEND_QUEUE = 'whatsapp-send'

export interface WhatsAppSendJobData {
  templateId: string
}

// BullMQ owns this pool (built from config) and closes it on queue/worker close().
export const whatsappQueueConnection = {
  connectionString: env.DATABASE.URL,
  ssl: env.DATABASE.SSL.ENABLED
    ? { rejectUnauthorized: env.DATABASE.SSL.REJECT_UNAUTHORIZED }
    : undefined,
  // Dedicated schema keeps BullMQ tables separated from app tables
  schema: 'bullmq',
}

let migrationsDone = false
/** Run BullMQ's Postgres schema migrations once per process. Both the producer and the worker call this before touching the queue. */
export async function ensureWhatsAppQueueSchema(): Promise<void> {
  if (migrationsDone) return
  const pool = new Pool(whatsappQueueConnection)
  const client = await pool.connect()
  try {
    await runMigrations(client)
    migrationsDone = true
  } finally {
    client.release()
    await pool.end()
  }
}
