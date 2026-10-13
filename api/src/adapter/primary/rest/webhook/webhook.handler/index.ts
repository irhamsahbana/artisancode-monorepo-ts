import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IWebhookUsecase } from '@/contracts/webhook.contract'

import { findWebhookListHandler as makeFindList } from './find-list'
import { notifyWebhookHandler as makeNotify } from './notify'

export function createWebhookHandlerDeps(usecase: IWebhookUsecase) {
  const handlers = {
    notify: makeNotify(usecase),
    findList: makeFindList(usecase),
  }

  return {
    notify: (c: Context<AppEnv>) => withSpan('WebhookHandler.notify', () => handlers.notify(c)),
    findList: (c: Context<AppEnv>) =>
      withSpan('WebhookHandler.findList', () => handlers.findList(c)),
  }
}

export { createWebhookHandlerDeps as createWebhookHandler }
export default createWebhookHandlerDeps
