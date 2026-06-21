import { IContactUsecase } from '@/contracts/contact.contract'

import { createContactHandler } from './create'
import { deleteContactHandler } from './delete'
import { findContactByIdHandler } from './find-by-id'
import { findContactListHandler } from './find-list'
import { updateContactHandler } from './update'

export function createContactHandlerDeps(usecase: IContactUsecase) {
  return {
    create: createContactHandler(usecase),
    findById: findContactByIdHandler(usecase),
    findList: findContactListHandler(usecase),
    update: updateContactHandler(usecase),
    delete: deleteContactHandler(usecase),
  }
}
