import { getExecutor } from '@/common/executor'
import { contacts } from '@/db/schema'
import * as Entity from '@/entities/contact.entity'

import { ContactRepoDeps } from '../contact.repo'

export async function createContact(
  deps: ContactRepoDeps,
  req: Entity.CreateContactReq,
): Promise<Entity.Contact> {
  const [row] = await getExecutor()
    .insert(contacts)
    .values({
      customerId: req.customer_id,
      name: req.name,
      position: req.position,
      whatsapp: req.whatsapp,
      email: req.email,
      notes: req.notes,
      isPrimary: req.isPrimary ?? false,
    })
    .returning()
  return deps.toEntity(row)
}
