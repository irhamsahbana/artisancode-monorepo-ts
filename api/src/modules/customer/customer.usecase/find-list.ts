import * as Entity from '@/entities/customer.entity'

import { CustomerUsecaseDeps } from '../customer.usecase'

export async function findCustomerList(
  deps: CustomerUsecaseDeps,
  req: Entity.GetCustomerReq,
): Promise<Entity.CustomerList> {
  return deps.repo.findList(req)
}
