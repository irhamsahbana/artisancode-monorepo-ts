import { z } from 'zod'

const whatsappProvider = (process.env.WHATSAPP_PROVIDER || 'gowa') as 'gowa' | 'noop'

// Load-bearing or security-sensitive vars: a missing one here used to silently fall back to an
// insecure default (JWT_SECRET='secret', SECRETS_ENCRYPTION_KEY='') or an empty string that fails
// confusingly deep inside some other library (DATABASE_URL, S3 credentials). Fail loud and
// immediately at boot instead. GOWA_* is only required when it's actually the active provider —
// WHATSAPP_PROVIDER=noop is the intentional "no credentials needed" escape hatch for local dev.
const requiredEnvSchema = z
  .object({
    APP_ENV: z.enum(['local', 'development', 'staging', 'production', 'test'], {
      message:
        'APP_ENV is required and must be one of: local, development, staging, production, test',
    }),
    APP_NAME: z.string().min(1, 'APP_NAME is required'),
    APP_VERSION: z.string().min(1, 'APP_VERSION is required'),
    APP_LOG_LEVEL: z.string().min(1, 'APP_LOG_LEVEL is required'),
    APP_LOGGER: z.enum(['winston', 'pino'], {
      message: 'APP_LOGGER is required and must be "winston" or "pino"',
    }),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required — never fall back to a shared default'),
    JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
    SECRETS_ENCRYPTION_KEY: z
      .string()
      .regex(
        /^[0-9a-f]{64}$/i,
        'SECRETS_ENCRYPTION_KEY must be a 64-char hex string (generate with: openssl rand -hex 32)',
      ),
    S3_BUCKET: z.string().min(1, 'S3_BUCKET is required'),
    S3_ACCESS_KEY_ID: z.string().min(1, 'S3_ACCESS_KEY_ID is required'),
    S3_SECRET_ACCESS_KEY: z.string().min(1, 'S3_SECRET_ACCESS_KEY is required'),
    // Only load-bearing when WHATSAPP_PROVIDER=gowa — see superRefine below.
    // WHATSAPP_PROVIDER=noop is the intentional "no credentials needed" escape
    // hatch for local dev, so these stay optional in the schema shape itself.
    GOWA_BASE_URL: z.string().optional(),
    GOWA_BASIC_AUTH: z.string().optional(),
    GOWA_WEBHOOK_SECRET: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (whatsappProvider !== 'gowa') return
    if (!value.GOWA_BASE_URL) {
      ctx.addIssue({
        code: 'custom',
        path: ['GOWA_BASE_URL'],
        message: 'GOWA_BASE_URL is required when WHATSAPP_PROVIDER=gowa',
      })
    }
    if (!value.GOWA_BASIC_AUTH) {
      ctx.addIssue({
        code: 'custom',
        path: ['GOWA_BASIC_AUTH'],
        message: 'GOWA_BASIC_AUTH is required when WHATSAPP_PROVIDER=gowa',
      })
    }
    if (!value.GOWA_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: 'custom',
        path: ['GOWA_WEBHOOK_SECRET'],
        message:
          'GOWA_WEBHOOK_SECRET is required when WHATSAPP_PROVIDER=gowa — an empty secret would accept unsigned webhooks',
      })
    }
  })

export function parseRequiredEnv() {
  const parsed = requiredEnvSchema.safeParse(process.env)
  if (!parsed.success) {
    const lines = parsed.error.issues.map(
      (issue) => `  - ${issue.path.join('.')}: ${issue.message}`,
    )
    console.error(`Invalid environment configuration:\n${lines.join('\n')}`)
    process.exit(1)
  }
  return parsed.data
}

export { whatsappProvider }
