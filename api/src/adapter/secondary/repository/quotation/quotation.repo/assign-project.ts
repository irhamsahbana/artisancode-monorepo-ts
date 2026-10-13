import { eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { quotations } from '@/db/schema'
import * as Entity from '@/entities/quotation.entity'

import { QuotationRepoDeps } from '../quotation.repo'

export async function assignProject(
  deps: QuotationRepoDeps,
  req: Entity.AssignQuotationReq,
): Promise<Entity.QuotationRequest | null> {
  const [row] = await getExecutor()
    .update(quotations)
    .set({ projectId: req.projectId, updatedAt: new Date() })
    .where(eq(quotations.id, req.id))
    .returning()
  return row ? deps.toEntity(row) : null
}
