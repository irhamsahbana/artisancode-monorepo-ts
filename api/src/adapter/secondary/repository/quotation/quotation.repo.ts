import { IQuotationRepo } from '@/contracts/quotation.contract'
import { quotations } from '@/db/schema'
import * as Entity from '@/entities/quotation.entity'

import { assignProject } from './quotation.repo/assign-project'
import { createQuotation } from './quotation.repo/create'
import { findQuotationById } from './quotation.repo/find-by-id'
import { findQuotationList } from './quotation.repo/find-list'
import { updateQuotationStatus } from './quotation.repo/update-status'

export interface QuotationRepoDeps {
  toEntity: (data: typeof quotations.$inferSelect) => Entity.QuotationRequest
}

function toEntity(data: typeof quotations.$inferSelect): Entity.QuotationRequest {
  return {
    id: data.id,
    title: data.title,
    projectId: data.projectId,
    topic: data.topic,
    requesterName: data.requesterName,
    companyName: data.companyName,
    whatsapp: data.whatsapp,
    email: data.email,
    products: data.products.map((p) => ({
      productName: p.productName,
      specification: p.specification,
      quantity: p.quantity,
    })),
    notes: data.notes,
    status: data.status,
    createdAt: data.createdAt,
  }
}

export function createQuotationRepo(): IQuotationRepo {
  const deps: QuotationRepoDeps = { toEntity }

  return {
    create: (req) => createQuotation(deps, req),
    findById: (id) => findQuotationById(deps, id),
    findList: (req) => findQuotationList(deps, req),
    updateStatus: (id, status) => updateQuotationStatus(deps, id, status),
    assignProject: (req) => assignProject(deps, req),
  }
}

export default createQuotationRepo
