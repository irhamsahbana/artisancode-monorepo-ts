import { and, eq, ilike, isNull, or } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { contacts, customers } from '@/db/schema'
import * as ContactEntity from '@/entities/contact.entity'
import * as CustomerEntity from '@/entities/customer.entity'

function toContactEntity(data: typeof contacts.$inferSelect): ContactEntity.Contact {
  return {
    id: data.id,
    customerId: data.customerId,
    name: data.name,
    position: data.position,
    whatsapp: data.whatsapp,
    email: data.email,
    notes: data.notes,
    isPrimary: data.isPrimary,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  }
}

function toCustomerEntity(data: typeof customers.$inferSelect): CustomerEntity.Customer {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    categoryId: data.categoryId,
    segmentationId: data.segmentationId,
    areaId: data.areaId,
    status: data.status,
    potential: data.potential,
    hasContractHistory: data.hasContractHistory,
    lastRevenue: data.lastRevenue,
    lastContractYear: data.lastContractYear,
    primaryContactId: data.primaryContactId,
    gender: data.gender,
    address: data.address,
    birthPlace: data.birthPlace,
    dateOfBirth: data.dateOfBirth,
    religion: data.religion,
    education: data.education,
    email: data.email,
    spouseName: data.spouseName,
    spouseOccupation: data.spouseOccupation,
    childrenNames: data.childrenNames,
    childrenOccupation: data.childrenOccupation,
    character: data.character,
    hobby: data.hobby,
    companyName: data.companyName,
    position: data.position,
    companyAddress: data.companyAddress,
    whatsapp: data.whatsapp,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  }
}

async function queryContacts(q?: string): Promise<ContactEntity.ContactSearchResult[]> {
  const conditions = [isNull(contacts.deletedAt), isNull(customers.deletedAt)]

  if (q) {
    const pattern = `%${q}%`
    const matchesQuery = or(
      ilike(contacts.name, pattern),
      ilike(contacts.position, pattern),
      ilike(customers.name, pattern),
    )
    if (matchesQuery) conditions.push(matchesQuery)
  }

  const rows = await getExecutor()
    .select({ contact: contacts, customer: customers })
    .from(contacts)
    .innerJoin(customers, eq(contacts.customerId, customers.id))
    .where(and(...conditions))
    .orderBy(contacts.name)

  return rows.map((row) => ({
    contact: toContactEntity(row.contact),
    customer: toCustomerEntity(row.customer),
  }))
}

// Flat, ungrouped, unpaginated — used by pickers (broadcast targeting,
// project/birthday contact lookups) that need the full matching set.
export async function searchContacts(q?: string): Promise<ContactEntity.ContactSearchResult[]> {
  return queryContacts(q)
}

// Same person can appear as a separate Contact row per company ("pinjam
// perusahaan") — group by name so pagination counts people, not raw rows,
// and one person's full company list always lands on a single page. Used by
// the Key Person directory view only.
function groupByPerson(
  results: ContactEntity.ContactSearchResult[],
): ContactEntity.ContactPersonGroup[] {
  const groups = new Map<string, ContactEntity.ContactPersonGroup>()
  for (const r of results) {
    const key = r.contact.name.trim().toLowerCase()
    const group = groups.get(key)
    if (group) {
      group.entries.push(r)
    } else {
      groups.set(key, { name: r.contact.name, entries: [r] })
    }
  }
  return Array.from(groups.values())
}

export async function searchContactPersons(
  req: ContactEntity.SearchContactsReq,
): Promise<ContactEntity.ContactPersonGroupList> {
  const { q, pagination = {} } = req
  const { page = 1, per_page = 10 } = pagination

  const results = await queryContacts(q)
  const groups = groupByPerson(results).sort((a, b) => a.name.localeCompare(b.name))
  const total = groups.length
  const offset = (page - 1) * per_page

  return {
    items: groups.slice(offset, offset + per_page),
    pagination: { total, page, per_page, last_page: Math.max(1, Math.ceil(total / per_page)) },
  }
}
