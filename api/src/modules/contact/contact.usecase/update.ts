import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/contact.entity'

import { ContactUsecaseDeps } from '../contact.usecase'

export async function updateContact(
  deps: ContactUsecaseDeps,
  req: Entity.UpdateContactReq,
): Promise<Entity.Contact> {
  const item = await deps.repo.update(req)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Contact not found')
  return item
}
