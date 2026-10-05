import { AppError, ErrorCode } from '@artisancode/types'

import { env } from '@/config/env'

export interface GowaClientConfig {
  baseUrl: string
  /** "user:password" for HTTP basic auth */
  basicAuth: string
}

export function createGowaClientConfig(): GowaClientConfig {
  const config: GowaClientConfig = {
    baseUrl: env.GOWA.BASE_URL,
    basicAuth: env.GOWA.BASIC_AUTH,
  }

  if (!config.baseUrl || !config.basicAuth) {
    throw new AppError(
      ErrorCode.NOT_IMPLEMENTED,
      'Gowa is not configured: set GOWA_BASE_URL and GOWA_BASIC_AUTH',
    )
  }

  return config
}

export function authHeader(config: GowaClientConfig): string {
  return `Basic ${Buffer.from(config.basicAuth).toString('base64')}`
}

/** Normalize a stored phone number to gowa JID format (62xxx@s.whatsapp.net) */
export function toJid(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) throw new Error(`Invalid phone number: ${phone}`)
  // Local Indonesian format "08xx" -> "628xx"; already-international kept as-is
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits
  return `${normalized}@s.whatsapp.net`
}
