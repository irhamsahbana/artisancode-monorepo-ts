import { AppError, ErrorCode } from '@artisancode/types'

import { CustomerUsecaseDeps } from '../customer.usecase'

export async function deleteCustomer(deps: CustomerUsecaseDeps, id: string): Promise<void> {
  const item = await deps.repo.findById(id)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Customer not found')
  await deps.repo.delete(id)
}
