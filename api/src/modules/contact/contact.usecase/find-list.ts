import * as Entity from '@/entities/contact.entity'

import { ContactUsecaseDeps } from '../contact.usecase'

export async function findContactList(
  deps: ContactUsecaseDeps,
  req: Entity.GetContactReq,
): Promise<Entity.ContactList> {
  return deps.repo.findList(req)
}
