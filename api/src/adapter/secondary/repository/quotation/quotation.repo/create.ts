import { getExecutor } from '@/common/executor'
import { quotations } from '@/db/schema'
import * as Entity from '@/entities/quotation.entity'

import { QuotationRepoDeps } from '../quotation.repo'

export async function createQuotation(
  deps: QuotationRepoDeps,
  req: Entity.CreateQuotationReq,
): Promise<Entity.QuotationRequest> {
  const [row] = await getExecutor()
    .insert(quotations)
    .values({
      title: req.title,
      projectId: req.projectId,
      topic: req.topic,
      requesterName: req.requesterName,
      companyName: req.companyName,
      whatsapp: req.whatsapp,
      email: req.email,
      products: (req.products ?? []).map((p) => ({
        productName: p.productName,
        specification: p.specification,
        quantity: p.quantity,
      })),
      notes: req.notes,
    })
    .returning()
  return deps.toEntity(row)
}
