import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { ICustomerUsecase } from '@/contracts/customer.contract'

import { createCustomerHandler as makeCreate } from './create'
import { deleteCustomerHandler as makeDelete } from './delete'
import { downloadCustomerTemplateHandler as makeDownloadTemplate } from './download-template'
import { dryRunCustomerImportHandler as makeDryRunImport } from './dry-run-import'
import { executeCustomerImportHandler as makeExecuteImport } from './execute-import'
import { findCustomerByIdHandler as makeFindById } from './find-by-id'
import { findCustomerListHandler as makeFindList } from './find-list'
import { updateCustomerHandler as makeUpdate } from './update'

export function createCustomerHandlerDeps(usecase: ICustomerUsecase) {
  const handlers = {
    create: makeCreate(usecase),
    findById: makeFindById(usecase),
    findList: makeFindList(usecase),
    update: makeUpdate(usecase),
    delete: makeDelete(usecase),
    downloadTemplate: makeDownloadTemplate(usecase),
    dryRunImport: makeDryRunImport(usecase),
    executeImport: makeExecuteImport(usecase),
  }

  return {
    create: (c: Context<AppEnv>) => withSpan('CustomerHandler.create', () => handlers.create(c)),
    findById: (c: Context<AppEnv>) =>
      withSpan('CustomerHandler.findById', () => handlers.findById(c)),
    findList: (c: Context<AppEnv>) =>
      withSpan('CustomerHandler.findList', () => handlers.findList(c)),
    update: (c: Context<AppEnv>) => withSpan('CustomerHandler.update', () => handlers.update(c)),
    delete: (c: Context<AppEnv>) => withSpan('CustomerHandler.delete', () => handlers.delete(c)),
    downloadTemplate: (c: Context<AppEnv>) =>
      withSpan('CustomerHandler.downloadTemplate', () => handlers.downloadTemplate(c)),
    dryRunImport: (c: Context<AppEnv>) =>
      withSpan('CustomerHandler.dryRunImport', () => handlers.dryRunImport(c)),
    executeImport: (c: Context<AppEnv>) =>
      withSpan('CustomerHandler.executeImport', () => handlers.executeImport(c)),
  }
}

export { createCustomerHandlerDeps as createCustomerHandler }
