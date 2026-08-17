import { parseArgs } from 'util'

// --cmd=server (default) | worker | cron: run API, queue worker, and run-once
// cron tasks (--task=<name>) as separate processes
const { values } = parseArgs({
  args: Bun.argv,
  options: {
    cmd: {
      type: 'string',
      default: 'server',
    },
    task: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
})

async function main(): Promise<void> {
  switch (values.cmd) {
    case 'server': {
      const { default: App } = await import('./bin/app')
      new App()
      break
    }
    case 'worker': {
      const { default: runWorker } = await import('./bin/worker')
      await runWorker()
      break
    }
    case 'cron': {
      if (!values.task) {
        console.error('Must provide --task when running cron')
        process.exit(1)
      }
      const { default: runCron } = await import('./bin/cron')
      await runCron(values.task)
      break
    }
    default:
      console.error(`Unknown command: ${values.cmd}`)
      process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error', error)
  process.exit(1)
})
