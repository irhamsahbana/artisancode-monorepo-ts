import * as Entity from '@/entities/contact.entity'

import { ContactUsecaseDeps } from '../contact.usecase'

export async function createContact(
  deps: ContactUsecaseDeps,
  req: Entity.CreateContactReq,
): Promise<Entity.Contact> {
  return deps.repo.create(req)
}
