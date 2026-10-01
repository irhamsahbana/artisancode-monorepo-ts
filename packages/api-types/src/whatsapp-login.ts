import type { LoginRes } from './auth'

export interface RequestWhatsAppLoginReq {
  phone: string
}

export interface RequestWhatsAppLoginRes {
  requestId: string
  confirmMessage: string
  businessWhatsapp: string
}

export interface WhatsAppLoginStatusRes {
  pending: boolean
  login?: LoginRes
}
