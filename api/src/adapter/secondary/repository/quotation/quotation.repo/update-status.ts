import { eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { quotations } from '@/db/schema'
import * as Entity from '@/entities/quotation.entity'

import { QuotationRepoDeps } from '../quotation.repo'

export async function updateQuotationStatus(
  deps: QuotationRepoDeps,
  id: string,
  status: Entity.QuotationStatus,
): Promise<Entity.QuotationRequest | null> {
  const [row] = await getExecutor()
    .update(quotations)
    .set({ status, updatedAt: new Date() })
    .where(eq(quotations.id, id))
    .returning()
  return row ? deps.toEntity(row) : null
}
