import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IBroadcastUsecase } from '@/contracts/broadcast.contract'

import { createBroadcastTemplateHandler as makeCreateTemplate } from './create-template'
import { deleteBroadcastTemplateHandler as makeDeleteTemplate } from './delete-template'
import { findBroadcastLogsHandler as makeFindLogs } from './find-logs'
import { findBroadcastLogsByTemplateIdHandler as makeFindLogsByTemplateId } from './find-logs-by-template-id'
import { findBroadcastTemplateListHandler as makeFindTemplateList } from './find-template-list'
import { sendBroadcastHandler as makeSend } from './send'

export function createBroadcastHandlerDeps(usecase: IBroadcastUsecase) {
  const handlers = {
    createTemplate: makeCreateTemplate(usecase),
    findTemplateList: makeFindTemplateList(usecase),
    findLogs: makeFindLogs(usecase),
    findLogsByTemplateId: makeFindLogsByTemplateId(usecase),
    deleteTemplate: makeDeleteTemplate(usecase),
    send: makeSend(usecase),
  }

  return {
    createTemplate: (c: Context<AppEnv>) =>
      withSpan('BroadcastHandler.createTemplate', () => handlers.createTemplate(c)),
    findTemplateList: (c: Context<AppEnv>) =>
      withSpan('BroadcastHandler.findTemplateList', () => handlers.findTemplateList(c)),
    findLogs: (c: Context<AppEnv>) => withSpan('BroadcastHandler.findLogs', () => handlers.findLogs(c)),
    findLogsByTemplateId: (c: Context<AppEnv>) =>
      withSpan('BroadcastHandler.findLogsByTemplateId', () => handlers.findLogsByTemplateId(c)),
    deleteTemplate: (c: Context<AppEnv>) =>
      withSpan('BroadcastHandler.deleteTemplate', () => handlers.deleteTemplate(c)),
    send: (c: Context<AppEnv>) => withSpan('BroadcastHandler.send', () => handlers.send(c)),
  }
}

export { createBroadcastHandlerDeps as createBroadcastHandler }
export default createBroadcastHandlerDeps
