import { env } from '@/config/env'
import logger from '@/config/logger'
import {
  IWhatsAppProvider,
  SendChatPresenceReq,
  SendWhatsAppTextReq,
  SendWhatsAppTextRes,
} from '@/contracts/integration/whatsapp.contract'

import { createGowaClientConfig, GowaClientConfig } from './client'
import { sendChatPresence } from './send-chat-presence'
import { sendMessage } from './send-message'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Best-effort: a failed typing indicator should never block the real send.
const presenceBestEffort = (p: Promise<void>) =>
  p.catch((err) => logger.warn('Gowa chat-presence failed', { error: String(err) }))

export class GowaIntegration implements IWhatsAppProvider {
  readonly name = 'gowa'
  private config: GowaClientConfig

  constructor() {
    this.config = createGowaClientConfig()
  }

  async sendTextMessage(req: SendWhatsAppTextReq): Promise<SendWhatsAppTextRes> {
    // ponytail: typing indicator before the real send makes the traffic look
    // human, not scripted — best-effort, never blocks the actual message.
    const { TYPING_DELAY_MIN_MS, TYPING_DELAY_MAX_MS } = env.WHATSAPP
    await presenceBestEffort(this.sendChatPresence({ to: req.to, action: 'start' }))
    await sleep(TYPING_DELAY_MIN_MS + Math.random() * (TYPING_DELAY_MAX_MS - TYPING_DELAY_MIN_MS))

    const res = await sendMessage(this.config, req)

    await presenceBestEffort(this.sendChatPresence({ to: req.to, action: 'stop' }))
    return res
  }

  sendChatPresence(req: SendChatPresenceReq): Promise<void> {
    return sendChatPresence(this.config, req)
  }
}
