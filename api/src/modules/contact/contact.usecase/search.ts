import * as Entity from '@/entities/contact.entity'

import { ContactUsecaseDeps } from '../contact.usecase'

export async function searchContact(
  deps: ContactUsecaseDeps,
  q?: string,
): Promise<Entity.ContactSearchResult[]> {
  return deps.repo.search(q)
}
