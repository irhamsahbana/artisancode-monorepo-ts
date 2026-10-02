export interface WhatsappDevice {
  id: string
  isConnected: boolean
  isLoggedIn: boolean
  jid: string
  isPrimary: boolean
}

export interface WhatsappLoginRes {
  qrLink: string
  qrDuration: number
}
