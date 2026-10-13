import path from 'path'

import { describe, expect, it } from 'bun:test'

// Spawns a real child process per case — env.ts validates at *module load* time
// and calls process.exit(1) on failure, so it can't be exercised by importing it
// directly in-process without killing the test runner.
function runWithEnv(env: Record<string, string | undefined>) {
  const envPath = path.join(import.meta.dir, '../env.ts')
  const result = Bun.spawnSync({
    cmd: ['bun', 'run', envPath],
    env: { ...process.env, ...env } as Record<string, string>,
    stdout: 'pipe',
    stderr: 'pipe',
  })
  return { exitCode: result.exitCode, stderr: result.stderr.toString() }
}

const validBase = {
  APP_ENV: 'development',
  APP_NAME: 'artisancode-backend-ts',
  APP_VERSION: '1.0.0',
  APP_LOG_LEVEL: 'info',
  APP_LOGGER: 'winston',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
  JWT_SECRET: 'jwt-secret',
  JWT_REFRESH_SECRET: 'jwt-refresh-secret',
  SECRETS_ENCRYPTION_KEY: 'a'.repeat(64),
  S3_BUCKET: 'bucket',
  S3_ACCESS_KEY_ID: 'key',
  S3_SECRET_ACCESS_KEY: 'secret',
  WHATSAPP_PROVIDER: 'gowa',
  GOWA_BASE_URL: 'https://gowa.example.com',
  GOWA_BASIC_AUTH: 'admin:pass',
  GOWA_WEBHOOK_SECRET: 'webhook-secret',
}

describe('env — required var validation', () => {
  it('boots cleanly when every required var is set', () => {
    const { exitCode } = runWithEnv(validBase)
    expect(exitCode).toBe(0)
  })

  it('exits 1 and names the var when JWT_SECRET is missing', () => {
    const { exitCode, stderr } = runWithEnv({ ...validBase, JWT_SECRET: '' })
    expect(exitCode).toBe(1)
    expect(stderr).toContain('JWT_SECRET')
  })

  it('exits 1 when SECRETS_ENCRYPTION_KEY is not a 64-char hex string', () => {
    const { exitCode, stderr } = runWithEnv({ ...validBase, SECRETS_ENCRYPTION_KEY: 'too-short' })
    expect(exitCode).toBe(1)
    expect(stderr).toContain('SECRETS_ENCRYPTION_KEY')
  })

  it('does not require GOWA_* when WHATSAPP_PROVIDER=noop', () => {
    const { exitCode } = runWithEnv({
      ...validBase,
      WHATSAPP_PROVIDER: 'noop',
      GOWA_BASE_URL: '',
      GOWA_BASIC_AUTH: '',
      GOWA_WEBHOOK_SECRET: '',
    })
    expect(exitCode).toBe(0)
  })

  it('exits 1 when GOWA_WEBHOOK_SECRET is missing and WHATSAPP_PROVIDER=gowa (default)', () => {
    const { exitCode, stderr } = runWithEnv({ ...validBase, GOWA_WEBHOOK_SECRET: '' })
    expect(exitCode).toBe(1)
    expect(stderr).toContain('GOWA_WEBHOOK_SECRET')
  })
})
