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
  if (req.type !== undefined) updates.type = req.type
  if (req.categoryId !== undefined) updates.categoryId = req.categoryId
  if (req.areaId !== undefined) updates.areaId = req.areaId
  if (req.status !== undefined) updates.status = req.status
  if (req.potential !== undefined) updates.potential = req.potential
  if (req.hasContractHistory !== undefined) updates.hasContractHistory = req.hasContractHistory
  if (req.lastRevenue !== undefined) updates.lastRevenue = req.lastRevenue.toString()
  if (req.lastContractYear !== undefined) updates.lastContractYear = req.lastContractYear
  if (req.primaryContactId !== undefined) updates.primaryContactId = req.primaryContactId
  if (req.gender !== undefined) updates.gender = req.gender
  if (req.address !== undefined) updates.address = req.address
  if (req.birthPlace !== undefined) updates.birthPlace = req.birthPlace
  if (req.dateOfBirth !== undefined) updates.dateOfBirth = req.dateOfBirth
  if (req.religion !== undefined) updates.religion = req.religion
  if (req.education !== undefined) updates.education = req.education
  if (req.email !== undefined) updates.email = req.email
  if (req.spouseName !== undefined) updates.spouseName = req.spouseName
  if (req.spouseOccupation !== undefined) updates.spouseOccupation = req.spouseOccupation
  if (req.childrenNames !== undefined) updates.childrenNames = req.childrenNames
  if (req.childrenOccupation !== undefined) updates.childrenOccupation = req.childrenOccupation
  if (req.character !== undefined) updates.character = req.character
  if (req.hobby !== undefined) updates.hobby = req.hobby
  if (req.companyName !== undefined) updates.companyName = req.companyName
  if (req.position !== undefined) updates.position = req.position
  if (req.companyAddress !== undefined) updates.companyAddress = req.companyAddress
  if (req.whatsapp !== undefined) updates.whatsapp = req.whatsapp
  if (req.notes !== undefined) updates.notes = req.notes

  const [row] = await getExecutor()
    .update(customers)
    .set(updates)
    .where(
      and(
        eq(customers.id, req.id),
        eq(customers.companyId, req.company_id),
        isNull(customers.deletedAt),
      ),
    )
    .returning()

  return row ? deps.toEntity(row) : null
}
