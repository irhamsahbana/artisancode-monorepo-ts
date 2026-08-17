import { withSpan } from '@artisancode/observability'

import { IUserRepo, IUserUsecase } from '@/contracts/user.contract'

import { createUser } from './user.usecase/create'
import { deleteUser } from './user.usecase/delete'
import { findUserById } from './user.usecase/find-by-id'
import { findUserByUsername } from './user.usecase/find-by-username'
import { findUserList } from './user.usecase/find-list'
import { loginUser } from './user.usecase/login'
import { refreshUserToken } from './user.usecase/refresh-token'
import { updateUser } from './user.usecase/update'

export interface UserUsecaseDeps {
  repo: IUserRepo
}

export function createUserUsecase(repo: IUserRepo): IUserUsecase {
  const deps: UserUsecaseDeps = { repo }

  return {
    create: (req) => withSpan('UserUsecase.create', () => createUser(deps, req)),
    login: (req) => withSpan('UserUsecase.login', () => loginUser(deps, req)),
    refreshToken: (req) => withSpan('UserUsecase.refreshToken', () => refreshUserToken(deps, req)),
    findList: (req) => findUserList(deps, req),
    findById: (id) => findUserById(deps, id),
    findByUsername: (username) => findUserByUsername(deps, username),
    update: (req) => updateUser(deps, req),
    delete: (id, requestedById) => deleteUser(deps, id, requestedById),
  }
}

export default createUserUsecase
