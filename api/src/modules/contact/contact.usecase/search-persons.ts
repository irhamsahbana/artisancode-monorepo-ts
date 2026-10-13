import * as Entity from '@/entities/contact.entity'

import { ContactUsecaseDeps } from '../contact.usecase'

export async function searchPersons(
  deps: ContactUsecaseDeps,
  req: Entity.SearchContactsReq,
): Promise<Entity.ContactPersonGroupList> {
  return deps.repo.searchPersons(req)
}
