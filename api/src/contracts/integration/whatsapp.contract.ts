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

export interface WhatsAppConnectionStatus {
  isConnected: boolean
  isLoggedIn: boolean
  /** WhatsApp JID of the logged-in account, empty when not logged in */
  jid: string
}

export interface WhatsAppLoginRes {
  /** URL of a QR code image to scan from the WhatsApp app */
  qrLink: string
  /** Seconds before the QR code expires */
  qrDuration: number
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
  /** Whether the connected device/number is online and logged in. */
  getConnectionStatus(): Promise<WhatsAppConnectionStatus>
  /** Starts a new pairing session — returns a QR code to scan. */
  login(): Promise<WhatsAppLoginRes>
  /** Logs the active device out, keeping its session slot. */
  logout(): Promise<void>
  /** Reconnects a previously logged-in device. */
  reconnect(): Promise<void>
}
