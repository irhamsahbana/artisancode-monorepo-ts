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

export async function searchContacts(q?: string): Promise<ContactEntity.ContactSearchResult[]> {
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
