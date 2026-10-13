import { parseRequiredEnv, whatsappProvider } from './env.schema'

const parseBoolean = (value: string | undefined, def: boolean): boolean => {
  if (value === undefined) return def
  return value.toLowerCase() === 'true'
}

const parseNumber = (value: string | undefined, def: number): number => {
  const n = Number(value)
  return Number.isFinite(n) ? n : def
}

const required = parseRequiredEnv()

export const env = {
  REST: {
    PORT: process.env.REST_PORT ? parseInt(process.env.REST_PORT, 10) : 3000,
  },
  APP_ENV: required.APP_ENV,
  APP_NAME: required.APP_NAME,
  APP_VERSION: required.APP_VERSION,
  APP_LOG_LEVEL: required.APP_LOG_LEVEL,
  APP_LOGGER: required.APP_LOGGER,
  IS_PRODUCTION: required.APP_ENV === 'production',
  // 64-char hex string (32 bytes) — encrypts secrets at rest (e.g. SMTP/API
  // keys in email_connections). Generate with: openssl rand -hex 32
  SECRETS_ENCRYPTION_KEY: required.SECRETS_ENCRYPTION_KEY,
  CORS: {
    ORIGINS: (process.env.CORS_ORIGINS || '')
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean),
    ALLOW_CREDENTIALS: parseBoolean(process.env.CORS_ALLOW_CREDENTIALS, true),
  },
  DATABASE_URL: required.DATABASE_URL,
  DATABASE: {
    URL: required.DATABASE_URL,
    // BullMQ's Postgres backend always pins search_path via a connection startup
    // parameter, which a pooled (e.g. pgbouncer) endpoint can reject. Point it at the
    // unpooled connection string instead; falls back to DATABASE_URL when unset
    // (e.g. a plain Postgres that isn't behind a pooler).
    URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED || required.DATABASE_URL,
    POOL: {
      MAX: parseNumber(process.env.DB_POOL_MAX, 20),
      MIN: parseNumber(process.env.DB_POOL_MIN, 5),
      IDLE_TIMEOUT_MS: parseNumber(process.env.DB_POOL_IDLE_TIMEOUT_MS, 60000),
      CONNECTION_TIMEOUT_MS: parseNumber(process.env.DB_POOL_CONN_TIMEOUT_MS, 2000),
    },
    SSL: {
      ENABLED: parseBoolean(process.env.DB_SSL_ENABLED, true),
      REJECT_UNAUTHORIZED: parseBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, false),
    },
  },
  JWT: {
    SECRET: required.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    REFRESH_SECRET: required.JWT_REFRESH_SECRET,
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  OTEL: {
    ENABLED: parseBoolean(process.env.OTEL_ENABLED, false),
    SAMPLING_RATIO: parseFloat(process.env.OTEL_SAMPLING_RATIO || '1'),
    EXPORTER: {
      OTLP: {
        ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
        TRACES_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
        LOGS_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT,
        HEADERS: process.env.OTEL_EXPORTER_OTLP_HEADERS,
        COMPRESSION: process.env.OTEL_EXPORTER_OTLP_COMPRESSION || 'none',
      },
    },
    DIAG_LOG_LEVEL: process.env.OTEL_DIAG_LOG_LEVEL,
  },
  DOKU: {
    CLIENT_ID: process.env.DOKU_CLIENT_ID,
    SECRET_KEY: process.env.DOKU_SECRET_KEY,
    PUBLIC_KEY: process.env.DOKU_PUBLIC_KEY,
  },
  WHATSAPP: {
    PROVIDER: whatsappProvider,
    // Random delay range between messages to reduce ban risk on unofficial API
    SEND_DELAY_MIN_MS: parseNumber(process.env.WHATSAPP_SEND_DELAY_MIN_MS, 10_000),
    SEND_DELAY_MAX_MS: parseNumber(process.env.WHATSAPP_SEND_DELAY_MAX_MS, 30_000),
    // Random "typing..." duration before each send, so traffic looks human
    TYPING_DELAY_MIN_MS: parseNumber(process.env.WHATSAPP_TYPING_DELAY_MIN_MS, 1_500),
    TYPING_DELAY_MAX_MS: parseNumber(process.env.WHATSAPP_TYPING_DELAY_MAX_MS, 4_000),
  },
  GOWA: {
    BASE_URL: required.GOWA_BASE_URL || '',
    // "user:password" (matches APP_BASIC_AUTH on the gowa server)
    BASIC_AUTH: required.GOWA_BASIC_AUTH || '',
    // Must match WHATSAPP_WEBHOOK_SECRET configured on the gowa server —
    // verifies the X-Hub-Signature-256 header on incoming message webhooks.
    WEBHOOK_SECRET: required.GOWA_WEBHOOK_SECRET || '',
  },
  S3: {
    BUCKET: required.S3_BUCKET,
    REGION: process.env.S3_REGION || 'ap-southeast-1',
    ACCESS_KEY_ID: required.S3_ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: required.S3_SECRET_ACCESS_KEY,
    ENDPOINT: process.env.S3_ENDPOINT || undefined,
    PUBLIC_BASE_URL: process.env.S3_PUBLIC_BASE_URL || '',
  },
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  // Shared volume read by both api (writes) and web (serves /favicon) so the
  // uploaded browser-tab icon survives container restarts.
  BRANDING_STORAGE_DIR: process.env.BRANDING_STORAGE_DIR || './storage/branding',
}
