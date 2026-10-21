import * as Entity from '@/entities/contact.entity'

import { ContactUsecaseDeps } from '../contact.usecase'

export async function createContacts(
  deps: ContactUsecaseDeps,
  reqs: Entity.CreateContactReq[],
): Promise<Entity.Contact[]> {
  return deps.repo.createMany(reqs)
}
