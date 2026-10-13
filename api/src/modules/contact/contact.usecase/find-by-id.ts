import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/contact.entity'

import { ContactUsecaseDeps } from '../contact.usecase'

export async function findContactById(
  deps: ContactUsecaseDeps,
  id: string,
): Promise<Entity.Contact> {
  const item = await deps.repo.findById(id)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Contact not found')
  return item
}
