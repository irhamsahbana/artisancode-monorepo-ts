import { AppError, ErrorCode } from '@artisancode/types'

import { SendWhatsAppTextReq, SendWhatsAppTextRes } from '@/contracts/integration/whatsapp.contract'

import { authHeader, GowaClientConfig, toJid } from './client'

interface GowaSendMessageResponse {
  code: string
  message: string
  results?: { message_id?: string }
}

export async function sendMessage(
  config: GowaClientConfig,
  deviceId: string,
  req: SendWhatsAppTextReq,
): Promise<SendWhatsAppTextRes> {
  const response = await fetch(`${config.baseUrl}/send/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(config),
      'X-Device-Id': deviceId,
    },
    body: JSON.stringify({ phone: toJid(req.to), message: req.message }),
  })

  const body = (await response.json().catch(() => null)) as GowaSendMessageResponse | null

  if (!response.ok || body?.code !== 'SUCCESS' || !body?.results?.message_id) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `Gowa send failed (${response.status}): ${body?.message ?? 'unknown error'}`,
    )
  }

  return { messageId: body.results.message_id }
}
