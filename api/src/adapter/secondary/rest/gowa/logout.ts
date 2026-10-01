import { AppError, ErrorCode } from '@artisancode/types'

import { GowaClientConfig } from './client'

export async function logout(config: GowaClientConfig): Promise<void> {
  const response = await fetch(`${config.baseUrl}/app/logout`, {
    headers: {
      Authorization: `Basic ${Buffer.from(config.basicAuth).toString('base64')}`,
      'X-Device-Id': config.deviceId,
    },
  })

  if (!response.ok) {
    throw new AppError(ErrorCode.EXTERNAL_SERVICE_ERROR, `Gowa logout failed (${response.status})`)
  }
}
