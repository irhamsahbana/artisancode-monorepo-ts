import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import * as schema from '@/db/schema'

import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql'

/**
 * Start a PostgreSQL container, push the schema via drizzle-kit CLI,
 * and return the drizzle instance + container reference for cleanup.
 *
 * Uses node subprocess for Testcontainers (bun has compatibility issues with it).
 */
export async function createTestDb(): Promise<{
  db: ReturnType<typeof drizzle>
  container: StartedPostgreSqlContainer
}> {
  // import.meta.dir = api/src/__tests__/helpers
  const apiDir = resolve(import.meta.dir, '../../..')
  const apiNodeModules = resolve(apiDir, 'node_modules')

  const uri = execSync(
    `node -e "
      const { PostgreSqlContainer } = require('${apiNodeModules}/@testcontainers/postgresql');
      (async () => {
        const c = await new PostgreSqlContainer('postgres:18-alpine')
          .withDatabase('test_db').withUsername('test').withPassword('test').start();
        process.stdout.write(c.getConnectionUri());
      })().catch(e => { process.stderr.write(e.message); process.exit(1); });
    "`,
    { encoding: 'utf-8', timeout: 30_000 },
  ).trim()

  const client = postgres(uri)
  const testDb = drizzle(client, { schema })

  await migrate(testDb, { migrationsFolder: resolve(apiDir, 'drizzle/migrations') })

  // Wrapper that stops the container by finding it via docker
  const container: StartedPostgreSqlContainer = {
    getConnectionUri: () => uri,
    getId: () => '',
    stop: async () => {
      try {
        await (testDb.$client as ReturnType<typeof postgres>).end()
      } catch {
        /* ignore */
      }
      try {
        execSync(
          'docker stop $(docker ps -q --filter "ancestor=postgres:18-alpine" | grep . | awk "NR==1")',
          {
            encoding: 'utf-8',
            timeout: 10_000,
          },
        )
      } catch {
        /* ignore */
      }
    },
  } as unknown as StartedPostgreSqlContainer

  return { db: testDb, container }
}

/**
 * Clean up: disconnect DB and stop container.
 */
export async function cleanupTestDb(
  container: StartedPostgreSqlContainer,
  db: ReturnType<typeof drizzle>,
): Promise<void> {
  try {
    await (db.$client as ReturnType<typeof postgres>).end()
  } catch {
    /* ignore */
  }
  try {
    await container.stop()
  } catch {
    /* ignore */
  }
}
