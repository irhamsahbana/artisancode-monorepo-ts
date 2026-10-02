import { SendChatPresenceReq } from '@/contracts/integration/whatsapp.contract'

import { authHeader, GowaClientConfig, toJid } from './client'

export async function sendChatPresence(
  config: GowaClientConfig,
  deviceId: string,
  req: SendChatPresenceReq,
): Promise<void> {
  const response = await fetch(`${config.baseUrl}/send/chat-presence`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(config),
      'X-Device-Id': deviceId,
    },
    body: JSON.stringify({ phone: toJid(req.to), action: req.action }),
  })

  if (!response.ok) {
    throw new Error(`Gowa chat-presence failed (${response.status})`)
  }
}
