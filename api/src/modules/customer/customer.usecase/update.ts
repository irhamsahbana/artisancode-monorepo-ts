import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/customer.entity'

import { CustomerUsecaseDeps } from '../customer.usecase'

export async function updateCustomer(
  deps: CustomerUsecaseDeps,
  req: Entity.UpdateCustomerReq,
): Promise<Entity.Customer> {
  const item = await deps.repo.update(req)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Customer not found')
  return item
}
