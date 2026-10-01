import { AppError, ErrorCode } from '@artisancode/types'

import { GowaClientConfig } from './client'

export async function reconnect(config: GowaClientConfig): Promise<void> {
  const response = await fetch(`${config.baseUrl}/app/reconnect`, {
    headers: {
      Authorization: `Basic ${Buffer.from(config.basicAuth).toString('base64')}`,
      'X-Device-Id': config.deviceId,
    },
  })

  if (!response.ok) {
    throw new AppError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `Gowa reconnect failed (${response.status})`,
    )
  }
}
