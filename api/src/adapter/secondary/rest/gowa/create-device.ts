import { AppError, ErrorCode } from '@artisancode/types'

import { authHeader, GowaClientConfig } from './client'

interface GowaCreateDeviceResponse {
  code: string
  message: string
  results?: { id: string }
}

export async function createDevice(config: GowaClientConfig): Promise<string> {
  const response = await fetch(`${config.baseUrl}/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader(config) },
    body: JSON.stringify({}),
  })

  const body = (await response.json().catch(() => null)) as GowaCreateDeviceResponse | null

  if (!response.ok || body?.code !== 'SUCCESS' || !body.results?.id) {
    throw new AppError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `Gowa create device failed (${response.status}): ${body?.message ?? 'unknown error'}`,
    )
  }

  return body.results.id
}
