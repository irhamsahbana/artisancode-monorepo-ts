import { runMigrations } from 'bullmq'
import { Pool } from 'pg'

import { env } from '@/config/env'

export const WHATSAPP_SEND_QUEUE = 'whatsapp-send'

export interface WhatsAppSendJobData {
  templateId: string
}

const QUEUE_SCHEMA = 'bullmq'

// BullMQ owns this pool (built from config) and closes it on queue/worker close().
// Uses the unpooled DB connection: BullMQ pins search_path via a connection startup
// parameter, which Neon's pooled (pgbouncer) endpoint rejects.
export const whatsappQueueConnection = {
  connectionString: env.DATABASE.URL_UNPOOLED,
  ssl: env.DATABASE.SSL.ENABLED
    ? { rejectUnauthorized: env.DATABASE.SSL.REJECT_UNAUTHORIZED }
    : undefined,
  // Dedicated schema keeps BullMQ tables separated from app tables
  schema: QUEUE_SCHEMA,
}

let migrationsDone = false
/** Run BullMQ's Postgres schema migrations once per process. Both the producer and the worker call this before touching the queue. */
export async function ensureWhatsAppQueueSchema(): Promise<void> {
  if (migrationsDone) return
  const pool = new Pool(whatsappQueueConnection)
  const client = await pool.connect()
  try {
    await runMigrations(client, QUEUE_SCHEMA)
    migrationsDone = true
  } finally {
    client.release()
    await pool.end()
  }
}
