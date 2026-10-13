import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IUserUsecase } from '@/contracts/user.contract'

import { createUserHandler } from './create'
import { deleteUserHandler } from './delete'
import { findUserByIdHandler } from './find-by-id'
import { findUserListHandler } from './find-list'
import { loginUserHandler } from './login'
import { logoutHandler } from './logout'
import { getMeHandler } from './me'
import { refreshTokenHandler } from './refresh-token'
import { updateUserHandler } from './update'
import { updateAccountHandler } from './update-account'

export function createUserHandlerDeps(usecase: IUserUsecase) {
  const handlers = {
    create: createUserHandler(usecase),
    login: loginUserHandler(usecase),
    logout: logoutHandler(),
    refreshToken: refreshTokenHandler(usecase),
    findList: findUserListHandler(usecase),
    findById: findUserByIdHandler(usecase),
    me: getMeHandler(usecase),
    updateAccount: updateAccountHandler(),
    update: updateUserHandler(usecase),
    delete: deleteUserHandler(usecase),
  }

  return {
    create: (c: Context<AppEnv>) => withSpan('UserHandler.create', () => handlers.create(c)),
    login: (c: Context<AppEnv>) => withSpan('UserHandler.login', () => handlers.login(c)),
    logout: (c: Context<AppEnv>) => withSpan('UserHandler.logout', () => handlers.logout(c)),
    refreshToken: (c: Context<AppEnv>) => withSpan('UserHandler.refreshToken', () => handlers.refreshToken(c)),
    findList: (c: Context<AppEnv>) => withSpan('UserHandler.findList', () => handlers.findList(c)),
    findById: (c: Context<AppEnv>) => withSpan('UserHandler.findById', () => handlers.findById(c)),
    me: (c: Context<AppEnv>) => withSpan('UserHandler.me', () => handlers.me(c)),
    updateAccount: (c: Context<AppEnv>) => withSpan('UserHandler.updateAccount', () => handlers.updateAccount(c)),
    update: (c: Context<AppEnv>) => withSpan('UserHandler.update', () => handlers.update(c)),
    delete: (c: Context<AppEnv>) => withSpan('UserHandler.delete', () => handlers.delete(c)),
  }
}

export { createUserHandlerDeps as createUserHandler }
