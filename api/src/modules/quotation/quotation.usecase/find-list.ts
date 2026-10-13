import * as Entity from '@/entities/quotation.entity'

import { QuotationUsecaseDeps } from '../quotation.usecase'

export async function findQuotationList(
  deps: QuotationUsecaseDeps,
  req: Entity.GetQuotationListReq,
): Promise<Entity.QuotationList> {
  return deps.repo.findList(req)
}
