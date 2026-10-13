import { eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { quotations } from '@/db/schema'
import * as Entity from '@/entities/quotation.entity'

import { QuotationRepoDeps } from '../quotation.repo'

export async function findQuotationById(
  deps: QuotationRepoDeps,
  id: string,
): Promise<Entity.QuotationRequest | null> {
  const [row] = await getExecutor().select().from(quotations).where(eq(quotations.id, id)).limit(1)
  return row ? deps.toEntity(row) : null
}
