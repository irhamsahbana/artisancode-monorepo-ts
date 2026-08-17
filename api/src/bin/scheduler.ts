import { disconnect } from '@/common/db'
import logger from '@/config/logger'
import { startScheduler, stopScheduler } from '@/jobs/scheduler'

async function runScheduler(): Promise<void> {
  await startScheduler()

  const shutdown = async () => {
    stopScheduler()
    await disconnect()
    process.exit(0)
  }
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
  process.once('SIGUSR2', shutdown)

  logger.info('Scheduler daemon running', { label: 'SCHEDULER' })
  // Keep process alive; cronbake's internal timers hold the event loop
  setInterval(() => undefined, 1 << 30)
}

export default runScheduler
