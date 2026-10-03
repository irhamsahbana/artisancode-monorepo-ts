import { AppError, ErrorCode } from '@artisancode/types'

import { env } from '@/config/env'
import { WhatsAppLoginRes } from '@/contracts/integration/whatsapp.contract'

import { authHeader, GowaClientConfig } from './client'

interface GowaLoginResponse {
  code: string
  message: string
  results?: {
    qr_link: string
    qr_duration: number
  }
}

export async function login(config: GowaClientConfig, deviceId: string): Promise<WhatsAppLoginRes> {
  const response = await fetch(`${config.baseUrl}/app/login`, {
    headers: {
      Authorization: authHeader(config),
      'X-Device-Id': deviceId,
    },
  })

  const body = (await response.json().catch(() => null)) as GowaLoginResponse | null

  if (!response.ok || body?.code !== 'SUCCESS' || !body.results) {
    throw new AppError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `Gowa login failed (${response.status}): ${body?.message ?? 'unknown error'}`,
    )
  }

  // gowa's own qr_link is only reachable inside the Docker network. The admin's
  // browser needs the image, so route it through our already-public API instead
  // of requiring gowa itself to have a public domain.
  const qrPath = new URL(body.results.qr_link).pathname
  return {
    qrLink: `${env.API_BASE_URL}/whatsapp/qr-image?path=${encodeURIComponent(qrPath)}`,
    qrDuration: body.results.qr_duration,
  }
}
