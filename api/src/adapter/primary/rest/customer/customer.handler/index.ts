import { ICustomerUsecase } from '@/contracts/customer.contract'

import { createCustomerHandler } from './create'
import { deleteCustomerHandler } from './delete'
import { findCustomerByIdHandler } from './find-by-id'
import { findCustomerListHandler } from './find-list'
import { updateCustomerHandler } from './update'

export function createCustomerHandlerDeps(usecase: ICustomerUsecase) {
  return {
    create: createCustomerHandler(usecase),
    findById: findCustomerByIdHandler(usecase),
    findList: findCustomerListHandler(usecase),
    update: updateCustomerHandler(usecase),
    delete: deleteCustomerHandler(usecase),
  }
}
