import { AppError, ErrorCode } from '@artisancode/types'

import { authHeader, GowaClientConfig } from './client'

interface GowaDeviceListResponse {
  code: string
  message: string
  results: { id: string }[] | null
}

/** Device ids only — live connection details come from /app/status per device. */
export async function listDeviceIds(config: GowaClientConfig): Promise<string[]> {
  const response = await fetch(`${config.baseUrl}/devices`, {
    headers: { Authorization: authHeader(config) },
  })

  const body = (await response.json().catch(() => null)) as GowaDeviceListResponse | null

  if (!response.ok || body?.code !== 'SUCCESS') {
    throw new AppError(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `Gowa list devices failed (${response.status}): ${body?.message ?? 'unknown error'}`,
    )
  }

  return (body.results ?? []).map((d) => d.id)
}
