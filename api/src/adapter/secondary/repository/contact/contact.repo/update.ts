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
  if (req.email !== undefined) updates.email = req.email
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
