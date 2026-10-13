import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IQuotationUsecase } from '@/contracts/quotation.contract'

import { assignProjectHandler as makeAssignProject } from './assign-project'
import { createQuotationHandler as makeCreate } from './create'
import { findQuotationListHandler as makeFindList } from './find-list'
import { updateQuotationStatusHandler as makeUpdateStatus } from './update-status'

export function createQuotationHandlerDeps(usecase: IQuotationUsecase) {
  const handlers = {
    create: makeCreate(usecase),
    findList: makeFindList(usecase),
    updateStatus: makeUpdateStatus(usecase),
    assignProject: makeAssignProject(usecase),
  }

  return {
    create: (c: Context<AppEnv>) => withSpan('QuotationHandler.create', () => handlers.create(c)),
    findList: (c: Context<AppEnv>) =>
      withSpan('QuotationHandler.findList', () => handlers.findList(c)),
    updateStatus: (c: Context<AppEnv>) =>
      withSpan('QuotationHandler.updateStatus', () => handlers.updateStatus(c)),
    assignProject: (c: Context<AppEnv>) =>
      withSpan('QuotationHandler.assignProject', () => handlers.assignProject(c)),
  }
}

export { createQuotationHandlerDeps as createQuotationHandler }
