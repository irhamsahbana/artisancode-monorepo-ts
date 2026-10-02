import { AppError, ErrorCode } from '@artisancode/types'

import { authHeader, GowaClientConfig } from './client'

export async function reconnect(config: GowaClientConfig, deviceId: string): Promise<void> {
  const response = await fetch(`${config.baseUrl}/app/reconnect`, {
    headers: {
      Authorization: authHeader(config),
      'X-Device-Id': deviceId,
    },
  })

  if (!response.ok) {
    throw new AppError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `Gowa reconnect failed (${response.status})`,
    )
  }
}
