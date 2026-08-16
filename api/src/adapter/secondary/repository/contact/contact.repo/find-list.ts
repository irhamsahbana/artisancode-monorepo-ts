import { and, eq, isNull, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { contacts } from '@/db/schema'
import * as Entity from '@/entities/contact.entity'

import { ContactRepoDeps } from '../contact.repo'

export async function findContactList(
  deps: ContactRepoDeps,
  req: Entity.GetContactReq,
): Promise<Entity.ContactList> {
  const { pagination = {}, customer_id } = req
  const { page = 1, per_page = 10 } = pagination
  const offset = (page - 1) * per_page

  const where = and(eq(contacts.customerId, customer_id), isNull(contacts.deletedAt))
  const exec = getExecutor()

  const [items, countResult] = await Promise.all([
    exec
      .select()
      .from(contacts)
      .where(where)
      .orderBy(sql`${contacts.isPrimary} desc, ${contacts.createdAt} asc`)
      .limit(per_page)
      .offset(offset),
    exec
      .select({ count: sql<number>`count(*)::int` })
      .from(contacts)
      .where(where),
  ])

  const total = countResult[0]?.count ?? 0

  return {
    items: items.map((item) => deps.toEntity(item)),
    pagination: { total, page, per_page, last_page: Math.ceil(total / per_page) },
  }
}
