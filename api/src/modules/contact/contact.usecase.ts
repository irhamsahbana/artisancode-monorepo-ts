import { IContactRepo, IContactUsecase } from '@/contracts/contact.contract'

import { createContact } from './contact.usecase/create'
import { createContacts } from './contact.usecase/create-many'
import { deleteContact } from './contact.usecase/delete'
import { findContactById } from './contact.usecase/find-by-id'
import { findContactList } from './contact.usecase/find-list'
import { searchContact } from './contact.usecase/search'
import { searchPersons } from './contact.usecase/search-persons'
import { updateContact } from './contact.usecase/update'

export interface ContactUsecaseDeps {
  repo: IContactRepo
}

export function createContactUsecase(repo: IContactRepo): IContactUsecase {
  const deps: ContactUsecaseDeps = { repo }

  return {
    create: (req) => createContact(deps, req),
    createMany: (reqs) => createContacts(deps, reqs),
    findById: (id) => findContactById(deps, id),
    findList: (req) => findContactList(deps, req),
    search: (q) => searchContact(deps, q),
    searchPersons: (req) => searchPersons(deps, req),
    update: (req) => updateContact(deps, req),
    delete: (id) => deleteContact(deps, id),
  }
}

export default createContactUsecase
