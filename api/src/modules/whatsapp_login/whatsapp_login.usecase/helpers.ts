export const WA_LOGIN_KEYWORD = 'LOGIN'
export const CONFIRM_MESSAGE_PATTERN = /LOGIN\s+([A-Z0-9]{6,12})/i
export const REQUEST_TTL_MS = 5 * 60 * 1000

export function generateConfirmToken(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
}

/** "6281234567890@s.whatsapp.net" (or "...:1@s.whatsapp.net") -> "6281234567890" */
export function jidToPhone(jid: string): string {
  return jid.split('@')[0]?.split(':')[0] ?? ''
}
