import { and, eq, isNull, lte } from 'drizzle-orm'

import { createBroadcastRepo } from '@/adapter/secondary/repository/broadcast/broadcast.repo'
import { getExecutor } from '@/common/executor'
import logger from '@/config/logger'
import { broadcastTemplates } from '@/db/schema'
import { createBroadcastUsecase } from '@/modules/broadcast/broadcast.usecase'

/**
 * Run every minute (triggered by jobs/scheduler.ts): dispatch any broadcast
 * template whose scheduledAt has passed. usecase.send() enqueues with
 * jobId `broadcast:${templateId}`, so a still-in-flight send from a prior
 * tick is deduped rather than sent twice; status only flips to 'sent' once
 * the worker finishes, so a template stays picked up on every tick until then.
 */
export async function runDueBroadcastsCron(): Promise<void> {
  const due = await getExecutor()
    .select({ id: broadcastTemplates.id, name: broadcastTemplates.name })
    .from(broadcastTemplates)
    .where(
      and(
        eq(broadcastTemplates.status, 'scheduled'),
        lte(broadcastTemplates.scheduledAt, new Date()),
        isNull(broadcastTemplates.deletedAt),
      ),
    )

  if (due.length === 0) return

  const usecase = createBroadcastUsecase(createBroadcastRepo())
  for (const template of due) {
    try {
      await usecase.send({ templateId: template.id })
      logger.info('Dispatched scheduled broadcast', {
        label: 'CRON',
        data: { templateId: template.id, name: template.name },
      })
    } catch (error) {
      logger.error('Failed to dispatch scheduled broadcast', {
        label: 'CRON',
        data: {
          templateId: template.id,
          error: error instanceof Error ? error.message : String(error),
        },
      })
    }
  }
}
