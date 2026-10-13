import * as Entity from '@/entities/quotation.entity'

import { QuotationUsecaseDeps } from '../quotation.usecase'

export async function createQuotation(
  deps: QuotationUsecaseDeps,
  req: Entity.CreateQuotationReq,
): Promise<Entity.QuotationRequest> {
  return deps.repo.create(req)
}
