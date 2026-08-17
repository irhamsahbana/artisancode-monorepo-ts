import { IUserUsecase } from '@/contracts/user.contract'

import { createUserHandler } from './create'
import { deleteUserHandler } from './delete'
import { findUserByIdHandler } from './find-by-id'
import { findUserListHandler } from './find-list'
import { loginUserHandler } from './login'
import { getMeHandler } from './me'
import { updateUserHandler } from './update'
import { updateAccountHandler } from './update-account'

export function createUserHandlerDeps(usecase: IUserUsecase) {
  return {
    create: createUserHandler(usecase),
    login: loginUserHandler(usecase),
    findList: findUserListHandler(usecase),
    findById: findUserByIdHandler(usecase),
    me: getMeHandler(usecase),
    updateAccount: updateAccountHandler(),
    update: updateUserHandler(usecase),
    delete: deleteUserHandler(usecase),
  }
}
