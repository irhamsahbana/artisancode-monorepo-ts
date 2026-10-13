import { AppError, ErrorCode } from '@artisancode/types'

import { ContactUsecaseDeps } from '../contact.usecase'

export async function deleteContact(deps: ContactUsecaseDeps, id: string): Promise<void> {
  const item = await deps.repo.findById(id)
  if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Contact not found')
  await deps.repo.delete(id)
}
