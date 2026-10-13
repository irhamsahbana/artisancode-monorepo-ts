import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IContactUsecase } from '@/contracts/contact.contract'

import { createContactHandler as makeCreate } from './create'
import { deleteContactHandler as makeDelete } from './delete'
import { findContactByIdHandler as makeFindById } from './find-by-id'
import { findContactListHandler as makeFindList } from './find-list'
import { searchContactsHandler as makeSearch } from './search'
import { searchContactPersonsHandler as makeSearchPersons } from './search-persons'
import { updateContactHandler as makeUpdate } from './update'

export function createContactHandlerDeps(usecase: IContactUsecase) {
  const handlers = {
    create: makeCreate(usecase),
    findById: makeFindById(usecase),
    findList: makeFindList(usecase),
    search: makeSearch(usecase),
    searchPersons: makeSearchPersons(usecase),
    update: makeUpdate(usecase),
    delete: makeDelete(usecase),
  }

  return {
    create: (c: Context<AppEnv>) => withSpan('ContactHandler.create', () => handlers.create(c)),
    findById: (c: Context<AppEnv>) =>
      withSpan('ContactHandler.findById', () => handlers.findById(c)),
    findList: (c: Context<AppEnv>) =>
      withSpan('ContactHandler.findList', () => handlers.findList(c)),
    search: (c: Context<AppEnv>) => withSpan('ContactHandler.search', () => handlers.search(c)),
    searchPersons: (c: Context<AppEnv>) =>
      withSpan('ContactHandler.searchPersons', () => handlers.searchPersons(c)),
    update: (c: Context<AppEnv>) => withSpan('ContactHandler.update', () => handlers.update(c)),
    delete: (c: Context<AppEnv>) => withSpan('ContactHandler.delete', () => handlers.delete(c)),
  }
}

export { createContactHandlerDeps as createContactHandler }
