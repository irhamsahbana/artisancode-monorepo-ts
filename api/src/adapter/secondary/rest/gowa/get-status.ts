import { AppError, ErrorCode } from '@artisancode/types'

import { WhatsAppConnectionStatus } from '@/contracts/integration/whatsapp.contract'

import { GowaClientConfig } from './client'

interface GowaStatusResponse {
  code: string
  message: string
  results?: {
    is_connected: boolean
    is_logged_in: boolean
    jid: string
  }
}

export async function getStatus(config: GowaClientConfig): Promise<WhatsAppConnectionStatus> {
  const response = await fetch(`${config.baseUrl}/app/status`, {
    headers: {
      Authorization: `Basic ${Buffer.from(config.basicAuth).toString('base64')}`,
      'X-Device-Id': config.deviceId,
    },
  })

  const body = (await response.json().catch(() => null)) as GowaStatusResponse | null

  if (!response.ok || body?.code !== 'SUCCESS' || !body.results) {
    throw new AppError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `Gowa status check failed (${response.status}): ${body?.message ?? 'unknown error'}`,
    )
  }

  return {
    isConnected: body.results.is_connected,
    isLoggedIn: body.results.is_logged_in,
    jid: body.results.jid,
  }
}
