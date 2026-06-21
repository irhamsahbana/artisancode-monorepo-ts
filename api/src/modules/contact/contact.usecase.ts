import { AppError, ErrorCode } from '@artisancode/types'

import { IContactRepo, IContactUsecase } from '@/contracts/contact.contract'

export function createContactUsecase(repo: IContactRepo): IContactUsecase {
  return {
    create: (req) => repo.create(req),

    findById: async (id) => {
      const item = await repo.findById(id)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Contact not found')
      return item
    },

    findList: (req) => repo.findList(req),

    update: async (req) => {
      const item = await repo.update(req)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Contact not found')
      return item
    },

    delete: async (id) => {
      const item = await repo.findById(id)
      if (!item) throw new AppError(ErrorCode.NOT_FOUND, 'Contact not found')
      await repo.delete(id)
    },
  }
}
