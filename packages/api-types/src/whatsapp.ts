export interface WhatsappStatus {
  isConnected: boolean
  isLoggedIn: boolean
  jid: string
}

export interface WhatsappLoginRes {
  qrLink: string
  qrDuration: number
}
