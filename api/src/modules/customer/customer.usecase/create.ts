import * as Entity from '@/entities/customer.entity'

import { CustomerUsecaseDeps } from '../customer.usecase'

export async function createCustomer(
  deps: CustomerUsecaseDeps,
  req: Entity.CreateCustomerReq,
): Promise<Entity.Customer> {
  return deps.repo.create(req)
}
