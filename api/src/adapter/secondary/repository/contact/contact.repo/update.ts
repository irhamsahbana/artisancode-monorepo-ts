import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { contacts } from '@/db/schema'
import * as Entity from '@/entities/contact.entity'

import { ContactRepoDeps } from '../contact.repo'

export async function updateContact(
  deps: ContactRepoDeps,
  req: Entity.UpdateContactReq,
): Promise<Entity.Contact | null> {
  const updates: Partial<typeof contacts.$inferInsert> = {
    updatedAt: sql`now()` as unknown as Date,
  }

  if (req.name !== undefined) updates.name = req.name
  if (req.position !== undefined) updates.position = req.position
  if (req.whatsapp !== undefined) updates.whatsapp = req.whatsapp
  if (req.country_code !== undefined) updates.countryCode = req.country_code
  if (req.email !== undefined) updates.email = req.email
  if (req.gender !== undefined) updates.gender = req.gender
  if (req.birthPlace !== undefined) updates.birthPlace = req.birthPlace
  if (req.dateOfBirth !== undefined) updates.dateOfBirth = req.dateOfBirth
  if (req.religion !== undefined) updates.religion = req.religion
  if (req.education !== undefined) updates.education = req.education
  if (req.address !== undefined) updates.address = req.address
  if (req.spouseName !== undefined) updates.spouseName = req.spouseName
  if (req.spouseOccupation !== undefined) updates.spouseOccupation = req.spouseOccupation
  if (req.childrenNames !== undefined) updates.childrenNames = req.childrenNames
  if (req.childrenOccupation !== undefined) updates.childrenOccupation = req.childrenOccupation
  if (req.profiling !== undefined) updates.profiling = req.profiling
  if (req.notes !== undefined) updates.notes = req.notes
  if (req.isPrimary !== undefined) updates.isPrimary = req.isPrimary

  const [row] = await getExecutor()
    .update(contacts)
    .set(updates)
    .where(
      and(
        eq(contacts.id, req.id),
        eq(contacts.customerId, req.customer_id),
        isNull(contacts.deletedAt),
      ),
    )
    .returning()

  return row ? deps.toEntity(row) : null
}
