import { IUserRepo } from '@/contracts/user.contract'
import { IWhatsAppLoginRepo, IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'

import { confirmWhatsAppLoginByIncomingMessage } from './whatsapp_login.usecase/confirm-by-incoming-message'
import { getWhatsAppLoginStatus } from './whatsapp_login.usecase/get-status'
import { requestWhatsAppLogin } from './whatsapp_login.usecase/request'

export const WA_LOGIN_KEYWORD = 'LOGIN'
const CONFIRM_MESSAGE_PATTERN = /LOGIN\s+([A-Z0-9]{6,12})/i
const REQUEST_TTL_MS = 5 * 60 * 1000

function generateConfirmToken(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
}

/** "6281234567890@s.whatsapp.net" (or "...:1@s.whatsapp.net") -> "6281234567890" */
function jidToPhone(jid: string): string {
  return jid.split('@')[0]?.split(':')[0] ?? ''
}

export interface WhatsAppLoginUsecaseDeps {
  repo: IWhatsAppLoginRepo
  userRepo: IUserRepo
  waLoginKeyword: string
  confirmMessagePattern: RegExp
  requestTtlMs: number
  generateConfirmToken: () => string
  jidToPhone: (jid: string) => string
}

export function createWhatsAppLoginUsecase(
  repo: IWhatsAppLoginRepo,
  userRepo: IUserRepo,
): IWhatsAppLoginUsecase {
  const deps: WhatsAppLoginUsecaseDeps = {
    repo,
    userRepo,
    waLoginKeyword: WA_LOGIN_KEYWORD,
    confirmMessagePattern: CONFIRM_MESSAGE_PATTERN,
    requestTtlMs: REQUEST_TTL_MS,
    generateConfirmToken,
    jidToPhone,
  }

  return {
    request: (req) => requestWhatsAppLogin(deps, req),
    getStatus: (id) => getWhatsAppLoginStatus(deps, id),
    confirmByIncomingMessage: (phone, messageBody) =>
      confirmWhatsAppLoginByIncomingMessage(deps, phone, messageBody),
  }
}

export default createWhatsAppLoginUsecase
