import { AppError, ErrorCode } from '@artisancode/types'

import { WhatsAppLoginRes } from '@/contracts/integration/whatsapp.contract'

import { GowaClientConfig } from './client'

interface GowaLoginResponse {
  code: string
  message: string
  results?: {
    qr_link: string
    qr_duration: number
  }
}

export async function login(config: GowaClientConfig): Promise<WhatsAppLoginRes> {
  const response = await fetch(`${config.baseUrl}/app/login`, {
    headers: {
      Authorization: `Basic ${Buffer.from(config.basicAuth).toString('base64')}`,
      'X-Device-Id': config.deviceId,
    },
  })

  const body = (await response.json().catch(() => null)) as GowaLoginResponse | null

  if (!response.ok || body?.code !== 'SUCCESS' || !body.results) {
    throw new AppError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `Gowa login failed (${response.status}): ${body?.message ?? 'unknown error'}`,
    )
  }

  return { qrLink: body.results.qr_link, qrDuration: body.results.qr_duration }
}
