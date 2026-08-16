import { and, eq, isNull } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { contacts } from '@/db/schema'
import * as Entity from '@/entities/contact.entity'

import { ContactRepoDeps } from '../contact.repo'

export async function findContactById(
  deps: ContactRepoDeps,
  id: string,
): Promise<Entity.Contact | null> {
  const [row] = await getExecutor()
    .select()
    .from(contacts)
    .where(and(eq(contacts.id, id), isNull(contacts.deletedAt)))
    .limit(1)
  return row ? deps.toEntity(row) : null
}
