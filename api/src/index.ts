import { parseArgs } from 'util'

// --cmd=server (default) | worker: run API and background worker as separate processes
const { values } = parseArgs({
  args: Bun.argv,
  options: {
    cmd: {
      type: 'string',
      default: 'server',
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
    default:
      console.error(`Unknown command: ${values.cmd}`)
      process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error', error)
  process.exit(1)
})
