import * as Entity from '@/entities/user.entity'

export interface IUserUsecase {
  create(req: Entity.CreateUserReq): Promise<Entity.User>
  login(req: Entity.LoginReq): Promise<Entity.LoginRes | null>
  refreshToken(req: Entity.RefreshTokenReq): Promise<Entity.LoginRes | null>
  findList(req: Entity.GetUserReq): Promise<Entity.UserList>
  findById(id: string): Promise<Entity.User | null>
  findByUsername(username: string): Promise<Entity.User | null>
  update(req: Entity.UpdateUserReq): Promise<Entity.User>
  delete(id: string, requestedById: string): Promise<void>
}

export interface IUserRepo {
  create(req: Entity.CreateUserReq): Promise<Entity.User>
  checkExistingUser(username: string, email: string): Promise<boolean>
  findList(req: Entity.GetUserReq): Promise<Entity.UserList>
  findById(id: string): Promise<Entity.User | null>
  findByUsername(username: string): Promise<Entity.User | null>
  findByUsernameForLogin(username: string): Promise<(Entity.User & { password: string }) | null>
  update(req: Entity.UpdateUserReq): Promise<Entity.User>
  delete(id: string): Promise<void>
}
