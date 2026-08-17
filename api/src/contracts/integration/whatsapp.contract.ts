export interface SendWhatsAppTextReq {
  /** Phone number in plain digits (e.g. 6281234567890) */
  to: string
  message: string
}

export interface SendWhatsAppTextRes {
  /** Provider-specific message id */
  messageId: string
}

/**
 * Provider-agnostic WhatsApp messaging port.
 * Implementations: gowa (unofficial multi-device API), WhatsApp Official API (later).
 */
export interface IWhatsAppProvider {
  readonly name: string
  sendTextMessage(req: SendWhatsAppTextReq): Promise<SendWhatsAppTextRes>
}
