import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/customer.entity'

import { CustomerUsecaseDeps } from '../customer.usecase'

export async function findCustomerById(
  deps: CustomerUsecaseDeps,
  id: string,
): Promise<Entity.Customer> {
  const item = await deps.repo.findById(id)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Customer not found')
  return item
}
