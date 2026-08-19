export interface SendWhatsAppTextReq {
  /** Phone number in plain digits (e.g. 6281234567890) */
  to: string
  message: string
}

export interface SendWhatsAppTextRes {
  /** Provider-specific message id */
  messageId: string
}

export interface SendChatPresenceReq {
  /** Phone number in plain digits (e.g. 6281234567890) */
  to: string
  action: 'start' | 'stop'
}

/**
 * Provider-agnostic WhatsApp messaging port.
 * Implementations: gowa (unofficial multi-device API), WhatsApp Official API (later).
 */
export interface IWhatsAppProvider {
  readonly name: string
  sendTextMessage(req: SendWhatsAppTextReq): Promise<SendWhatsAppTextRes>
  /** Typing indicator, best-effort — callers should not fail a send over this. */
  sendChatPresence(req: SendChatPresenceReq): Promise<void>
}
