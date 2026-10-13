import { ICustomerRepo, ICustomerUsecase } from '@/contracts/customer.contract'

import { createCustomer } from './customer.usecase/create'
import { deleteCustomer } from './customer.usecase/delete'
import { findCustomerById } from './customer.usecase/find-by-id'
import { findCustomerList } from './customer.usecase/find-list'
import { updateCustomer } from './customer.usecase/update'

export interface CustomerUsecaseDeps {
  repo: ICustomerRepo
}

export function createCustomerUsecase(repo: ICustomerRepo): ICustomerUsecase {
  const deps: CustomerUsecaseDeps = { repo }

  return {
    create: (req) => createCustomer(deps, req),
    findById: (id) => findCustomerById(deps, id),
    findList: (req) => findCustomerList(deps, req),
    update: (req) => updateCustomer(deps, req),
    delete: (id) => deleteCustomer(deps, id),
  }
}

export default createCustomerUsecase
