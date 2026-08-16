import { IContactRepo } from '@/contracts/contact.contract'
import { contacts } from '@/db/schema'
import * as Entity from '@/entities/contact.entity'

import { createContact } from './contact.repo/create'
import { deleteContact } from './contact.repo/delete'
import { findContactById } from './contact.repo/find-by-id'
import { findContactList } from './contact.repo/find-list'
import { updateContact } from './contact.repo/update'

export interface ContactRepoDeps {
  toEntity: (data: typeof contacts.$inferSelect) => Entity.Contact
}

function toEntity(data: typeof contacts.$inferSelect): Entity.Contact {
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

export function createContactRepo(): IContactRepo {
  const deps: ContactRepoDeps = { toEntity }

  return {
    create: (req) => createContact(deps, req),
    findById: (id) => findContactById(deps, id),
    findList: (req) => findContactList(deps, req),
    update: (req) => updateContact(deps, req),
    delete: (id) => deleteContact(id),
  }
}
