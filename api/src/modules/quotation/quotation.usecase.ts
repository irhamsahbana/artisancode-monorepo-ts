import { IQuotationRepo, IQuotationUsecase } from '@/contracts/quotation.contract'
import * as Entity from '@/entities/quotation.entity'

import { assignProject } from './quotation.usecase/assign-project'
import { createQuotation } from './quotation.usecase/create'
import { findQuotationById } from './quotation.usecase/find-by-id'
import { findQuotationList } from './quotation.usecase/find-list'
import { updateQuotationStatus } from './quotation.usecase/update-status'

export interface QuotationUsecaseDeps {
  repo: IQuotationRepo
}

// Forward-only lock: new -> in_review -> responded. responded is terminal.
export const ALLOWED_TRANSITIONS: Record<Entity.QuotationStatus, Entity.QuotationStatus[]> = {
  new: ['in_review'],
  in_review: ['responded'],
  responded: [],
}

export function createQuotationUsecase(repo: IQuotationRepo): IQuotationUsecase {
  const deps: QuotationUsecaseDeps = { repo }

  return {
    create: (req) => createQuotation(deps, req),
    findById: (id) => findQuotationById(deps, id),
    findList: (req) => findQuotationList(deps, req),
    updateStatus: (req) => updateQuotationStatus(deps, req),
    assignProject: (req) => assignProject(deps, req),
  }
}

export default createQuotationUsecase
