import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/quotation.entity'

import { QuotationUsecaseDeps } from '../quotation.usecase'

export async function assignProject(
  deps: QuotationUsecaseDeps,
  req: Entity.AssignQuotationReq,
): Promise<Entity.QuotationRequest> {
  const existing = await deps.repo.findById(req.id)
  if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Quotation not found')

  const item = await deps.repo.assignProject(req)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Quotation not found')
  return item
}
