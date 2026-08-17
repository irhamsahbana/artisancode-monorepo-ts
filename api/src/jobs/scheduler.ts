import { join } from 'path'

import Baker, { FilePersistenceProvider } from 'cronbake'

import logger from '@/config/logger'
import { runBirthdayGreetingCron } from '@/modules/birthday_greeting/birthday-greeting.cron'

let baker: ReturnType<typeof Baker.create> | null = null

const CRONBAKE_STATE_PATH = join(process.cwd(), 'cronbake-state.json')

/**
 * Starts the in-process cron scheduler. cronbake has no timezone option — it
 * reads the process's local time — so the deployed process needs
 * TZ=Asia/Jakarta for "@at_8:0" to mean 08:00 WIB rather than UTC.
 */
export async function startScheduler(): Promise<void> {
  baker = Baker.create({
    autoStart: false,
    persistence: {
      enabled: true,
      strategy: 'file',
      provider: new FilePersistenceProvider(CRONBAKE_STATE_PATH),
      autoRestore: true,
    },
    onError: (error, jobName) => {
      logger.error(`Scheduler job ${jobName} failed`, {
        label: 'SCHEDULER',
        data: { error: error.message },
      })
    },
  })

  await baker.ready()

  baker.add({
    name: 'birthday-greeting',
    cron: '@at_8:0',
    start: true,
    immediate: false,
    overrunProtection: true,
    callback: async () => {
      await runBirthdayGreetingCron()
    },
    onError: (error) => {
      logger.error('Birthday greeting job error', {
        label: 'SCHEDULER',
        data: { error: error.message },
      })
    },
  })

  logger.info('Scheduler started', {
    label: 'SCHEDULER',
    data: { job: 'birthday-greeting', cron: '@at_8:0', tz: process.env.TZ },
  })
}

/** Stop all scheduled jobs. */
export function stopScheduler(): void {
  baker?.stopAll()
}
