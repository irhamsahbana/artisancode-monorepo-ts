import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { customers } from '@/db/schema'
import * as Entity from '@/entities/customer.entity'

import { CustomerRepoDeps } from '../customer.repo'

export async function updateCustomer(
  deps: CustomerRepoDeps,
  req: Entity.UpdateCustomerReq,
): Promise<Entity.Customer | null> {
  const updates: Partial<typeof customers.$inferInsert> = {
    updatedAt: sql`now()` as unknown as Date,
  }

  if (req.name !== undefined) updates.name = req.name
  if (req.categoryId !== undefined) updates.categoryId = req.categoryId
  if (req.segmentationId !== undefined) updates.segmentationId = req.segmentationId
  if (req.areaId !== undefined) updates.areaId = req.areaId
  if (req.status !== undefined) updates.status = req.status
  if (req.potential !== undefined) updates.potential = req.potential
  if (req.hasContractHistory !== undefined) updates.hasContractHistory = req.hasContractHistory
  if (req.lastRevenue !== undefined) updates.lastRevenue = req.lastRevenue.toString()
  if (req.lastContractYear !== undefined) updates.lastContractYear = req.lastContractYear
  if (req.primaryContactId !== undefined) updates.primaryContactId = req.primaryContactId
  if (req.companyType !== undefined) updates.companyType = req.companyType
  if (req.address !== undefined) updates.address = req.address
  if (req.npwp !== undefined) updates.npwp = req.npwp
  if (req.skt !== undefined) updates.skt = req.skt
  if (req.companyEmail !== undefined) updates.companyEmail = req.companyEmail
  if (req.website !== undefined) updates.website = req.website
  if (req.notes !== undefined) updates.notes = req.notes

  const [row] = await getExecutor()
    .update(customers)
    .set(updates)
    .where(and(eq(customers.id, req.id), isNull(customers.deletedAt)))
    .returning()

  return row ? deps.toEntity(row) : null
}
