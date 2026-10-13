import { IBroadcastRepo, IBroadcastUsecase } from '@/contracts/broadcast.contract'

import { createBroadcastTemplate } from './broadcast.usecase/create-template'
import { deleteBroadcastTemplate } from './broadcast.usecase/delete-template'
import { findBroadcastLogs } from './broadcast.usecase/find-logs'
import { findBroadcastLogsByTemplateId } from './broadcast.usecase/find-logs-by-template-id'
import { findBroadcastTemplateList } from './broadcast.usecase/find-template-list'
import { sendBroadcast } from './broadcast.usecase/send'

export interface BroadcastUsecaseDeps {
  repo: IBroadcastRepo
}

export function createBroadcastUsecase(repo: IBroadcastRepo): IBroadcastUsecase {
  const deps: BroadcastUsecaseDeps = { repo }

  return {
    createTemplate: (req) => createBroadcastTemplate(deps, req),
    findTemplateList: (page, perPage) => findBroadcastTemplateList(deps, page, perPage),
    findLogs: () => findBroadcastLogs(deps),
    findLogsByTemplateId: (templateId) => findBroadcastLogsByTemplateId(deps, templateId),
    deleteTemplate: (id) => deleteBroadcastTemplate(deps, id),
    send: (req) => sendBroadcast(deps, req),
  }
}

export default createBroadcastUsecase
