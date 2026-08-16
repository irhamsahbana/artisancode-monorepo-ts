import { AppError, ErrorCode } from '@artisancode/types'

import { IQuotationRepo, IQuotationUsecase } from '@/contracts/quotation.contract'
import * as Entity from '@/entities/quotation.entity'

export interface QuotationUsecaseDeps {
  repo: IQuotationRepo
}

// Forward-only lock: new -> in_review -> responded. responded is terminal.
const ALLOWED_TRANSITIONS: Record<Entity.QuotationStatus, Entity.QuotationStatus[]> = {
  new: ['in_review'],
  in_review: ['responded'],
  responded: [],
}

export function createQuotationUsecase(repo: IQuotationRepo): IQuotationUsecase {
  const deps: QuotationUsecaseDeps = { repo }

  return {
    create: (req) => deps.repo.create(req),

    findById: async (id) => {
      const item = await deps.repo.findById(id)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Quotation not found')
      return item
    },

    findList: (req) => deps.repo.findList(req),

    updateStatus: async (req) => {
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
    },

    assignProject: async (req) => {
      const existing = await deps.repo.findById(req.id)
      if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Quotation not found')

      const item = await deps.repo.assignProject(req)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Quotation not found')
      return item
    },
  }
}
