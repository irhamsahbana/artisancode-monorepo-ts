import { withSpan } from '@artisancode/observability'

import { IUserRepo } from '@/contracts/user.contract'
import { IWhatsAppLoginRepo, IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'

import { confirmByIncomingMessage } from './whatsapp_login.usecase/confirm-by-incoming-message'
import { getWhatsAppLoginStatus } from './whatsapp_login.usecase/get-status'
import { WA_LOGIN_KEYWORD } from './whatsapp_login.usecase/helpers'
import { requestWhatsAppLogin } from './whatsapp_login.usecase/request'

export { WA_LOGIN_KEYWORD }

export interface WhatsAppLoginUsecaseDeps {
  repo: IWhatsAppLoginRepo
  userRepo: IUserRepo
}

export function createWhatsAppLoginUsecase(
  repo: IWhatsAppLoginRepo,
  userRepo: IUserRepo,
): IWhatsAppLoginUsecase {
  const deps: WhatsAppLoginUsecaseDeps = { repo, userRepo }

  return {
    request: (req) =>
      withSpan('WhatsAppLoginUsecase.request', () => requestWhatsAppLogin(deps, req)),
    getStatus: (id) =>
      withSpan('WhatsAppLoginUsecase.getStatus', () => getWhatsAppLoginStatus(deps, id)),
    confirmByIncomingMessage: (phone, messageBody) =>
      withSpan('WhatsAppLoginUsecase.confirmByIncomingMessage', () =>
        confirmByIncomingMessage(deps, phone, messageBody),
      ),
  }
}

export default createWhatsAppLoginUsecase
