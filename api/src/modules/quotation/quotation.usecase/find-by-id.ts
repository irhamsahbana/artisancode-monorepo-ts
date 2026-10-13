import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/quotation.entity'

import { QuotationUsecaseDeps } from '../quotation.usecase'

export async function findQuotationById(
  deps: QuotationUsecaseDeps,
  id: string,
): Promise<Entity.QuotationRequest> {
  const item = await deps.repo.findById(id)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Quotation not found')
  return item
}
