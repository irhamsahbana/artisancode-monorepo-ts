import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/quotation.entity'

import { ALLOWED_TRANSITIONS, QuotationUsecaseDeps } from '../quotation.usecase'

export async function updateQuotationStatus(
  deps: QuotationUsecaseDeps,
  req: Entity.UpdateQuotationStatusReq,
): Promise<Entity.QuotationRequest> {
  const existing = await deps.repo.findById(req.id)
  if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Quotation not found')

  const allowed = ALLOWED_TRANSITIONS[existing.status]
  if (!allowed.includes(req.status)) {
    throw new AppError(
      ErrorCode.QUOTATION_INVALID_STATUS_TRANSITION,
      `Invalid status transition: ${existing.status} -> ${req.status}. Allowed: ${allowed.join(', ') || 'none (terminal)'}`,
      { httpCode: 400 },
    )
  }

  const item = await deps.repo.updateStatus(req.id, req.status)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Quotation not found')
  return item
}
