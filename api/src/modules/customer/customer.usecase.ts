import { ICategoryUsecase } from '@/contracts/category.contract'
import { IContactUsecase } from '@/contracts/contact.contract'
import { ICustomerRepo, ICustomerUsecase } from '@/contracts/customer.contract'
import type { ITransactor } from '@/contracts/integration'

import { createCustomer } from './customer.usecase/create'
import { deleteCustomer } from './customer.usecase/delete'
import { dryRunImport } from './customer.usecase/dry-run-import'
import { executeImport } from './customer.usecase/execute-import'
import { findCustomerById } from './customer.usecase/find-by-id'
import { findCustomerList } from './customer.usecase/find-list'
import { generateTemplate } from './customer.usecase/generate-template'
import { updateCustomer } from './customer.usecase/update'

export interface CustomerUsecaseDeps {
  repo: ICustomerRepo
  categoryUsecase: ICategoryUsecase
  contactUsecase: IContactUsecase
  transactor?: ITransactor
}

export function createCustomerUsecase(
  repo: ICustomerRepo,
  categoryUsecase: ICategoryUsecase,
  contactUsecase: IContactUsecase,
  transactor?: ITransactor,
): ICustomerUsecase {
  const deps: CustomerUsecaseDeps = { repo, categoryUsecase, contactUsecase, transactor }

  return {
    create: (req) => createCustomer(deps, req),
    findById: (id) => findCustomerById(deps, id),
    findList: (req) => findCustomerList(deps, req),
    update: (req) => updateCustomer(deps, req),
    delete: (id) => deleteCustomer(deps, id),
    generateTemplate: () => generateTemplate(deps),
    dryRunImport: (fileBuffer) => dryRunImport(deps, fileBuffer),
    executeImport: (req) => executeImport(deps, req),
  }
}

export default createCustomerUsecase
