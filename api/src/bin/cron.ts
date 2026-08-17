import logger from '@/config/logger'

/** Run-once cron entrypoint, triggered by an external scheduler (e.g. Dokploy Schedule). */
async function runCron(task: string): Promise<void> {
  logger.info(`Starting cron task (run-once): ${task}`, { label: 'CRON' })

  try {
    switch (task) {
      case 'birthday-greeting': {
        const { runBirthdayGreetingCron } =
          await import('@/modules/birthday_greeting/birthday-greeting.cron')
        await runBirthdayGreetingCron()
        break
      }
      default:
        logger.error(`Unknown cron task: ${task}`, { label: 'CRON' })
        process.exitCode = 1
    }
  } catch (error) {
    logger.error(`Cron task ${task} failed`, { label: 'CRON', data: { error } })
    process.exitCode = 1
  }

  const { disconnect } = await import('@/common/db')
  await disconnect()
  process.exit(process.exitCode || 0)
}

export default runCron
