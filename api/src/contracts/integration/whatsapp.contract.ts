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

export interface WhatsAppDevice extends WhatsAppConnectionStatus {
  id: string
  /** The device that sendTextMessage/sendChatPresence actually use. */
  isPrimary: boolean
}

/**
 * Provider-agnostic WhatsApp messaging port.
 * Implementations: gowa (unofficial multi-device API), WhatsApp Official API (later).
 * A provider may manage several devices (numbers); sendTextMessage/sendChatPresence
 * always resolve to whichever one is marked primary.
 */
export interface IWhatsAppProvider {
  readonly name: string
  sendTextMessage(req: SendWhatsAppTextReq): Promise<SendWhatsAppTextRes>
  /** Typing indicator, best-effort — callers should not fail a send over this. */
  sendChatPresence(req: SendChatPresenceReq): Promise<void>
  listDevices(): Promise<WhatsAppDevice[]>
  /** Registers a new, not-yet-paired device slot. */
  addDevice(): Promise<WhatsAppDevice>
  removeDevice(deviceId: string): Promise<void>
  /** Whether the given device is online and logged in. */
  getConnectionStatus(deviceId: string): Promise<WhatsAppConnectionStatus>
  /** Starts a new pairing session for the given device — returns a QR code to scan. */
  login(deviceId: string): Promise<WhatsAppLoginRes>
  /** Logs the given device out, keeping its session slot. */
  logout(deviceId: string): Promise<void>
  /** Reconnects a previously logged-in device. */
  reconnect(deviceId: string): Promise<void>
}
