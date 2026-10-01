import type { LoginRes } from './user.entity'

export interface WhatsAppLoginRequestRow {
  id: string
  phone: string
  userId: string | null
  confirmToken: string
  expiresAt: Date
  verifiedAt: Date | null
  consumedAt: Date | null
  createdAt: Date
}

export interface CreateWhatsAppLoginRequestReq {
  phone: string
  userId: string | null
  confirmToken: string
  expiresAt: Date
}

export interface RequestWhatsAppLoginReq {
  phone: string
}

export interface RequestWhatsAppLoginRes {
  requestId: string
  /** Text the user must WhatsApp to confirm — keyword + their unique token. */
  confirmMessage: string
  /** Full digits (with country code) of the business WhatsApp number. */
  businessWhatsapp: string
}

export interface WhatsAppLoginStatusRes {
  pending: boolean
  /** Present exactly once, the first time status is polled after confirmation. */
  login?: LoginRes
}
