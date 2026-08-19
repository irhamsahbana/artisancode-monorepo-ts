import { SendChatPresenceReq } from '@/contracts/integration/whatsapp.contract'

import { GowaClientConfig, toJid } from './client'

export async function sendChatPresence(
  config: GowaClientConfig,
  req: SendChatPresenceReq,
): Promise<void> {
  const response = await fetch(`${config.baseUrl}/send/chat-presence`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(config.basicAuth).toString('base64')}`,
      'X-Device-Id': config.deviceId,
    },
    body: JSON.stringify({ phone: toJid(req.to), action: req.action }),
  })

  if (!response.ok) {
    throw new Error(`Gowa chat-presence failed (${response.status})`)
  }
}
