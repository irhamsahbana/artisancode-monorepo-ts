import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'

import { requestWhatsAppLoginHandler as makeRequest } from './request'
import { getWhatsAppLoginStatusHandler as makeStatus } from './status'

export function createWhatsAppLoginHandlerDeps(usecase: IWhatsAppLoginUsecase) {
  const handlers = {
    request: makeRequest(usecase),
    status: makeStatus(usecase),
  }

  return {
    request: (c: Context<AppEnv>) =>
      withSpan('WhatsAppLoginHandler.request', () => handlers.request(c)),
    status: (c: Context<AppEnv>) =>
      withSpan('WhatsAppLoginHandler.status', () => handlers.status(c)),
  }
}

export { createWhatsAppLoginHandlerDeps as createWhatsAppLoginHandler }
export default createWhatsAppLoginHandlerDeps
