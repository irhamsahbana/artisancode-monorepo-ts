import { AppError, ErrorCode } from '@artisancode/types'

import { authHeader, GowaClientConfig } from './client'

export async function deleteDevice(config: GowaClientConfig, deviceId: string): Promise<void> {
  const response = await fetch(`${config.baseUrl}/devices/${deviceId}`, {
    method: 'DELETE',
    headers: { Authorization: authHeader(config) },
  })

  if (!response.ok) {
    throw new AppError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `Gowa delete device failed (${response.status})`,
    )
  }
}
