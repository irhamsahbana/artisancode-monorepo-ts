import { IUserUsecase } from '@/contracts/user.contract'

import { createUserHandler } from './create'
import { findUserByIdHandler } from './find-by-id'
import { findUserListHandler } from './find-list'
import { loginUserHandler } from './login'
import { getMeHandler } from './me'
import { registerUserHandler } from './register'
import { updateAccountHandler } from './update-account'

export function createUserHandlerDeps(usecase: IUserUsecase) {
  return {
    create: createUserHandler(usecase),
    register: registerUserHandler(usecase),
    login: loginUserHandler(usecase),
    findList: findUserListHandler(usecase),
    findById: findUserByIdHandler(usecase),
    me: getMeHandler(usecase),
    updateAccount: updateAccountHandler(),
  }
}
