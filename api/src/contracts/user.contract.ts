import * as Entity from '@/entities/user.entity'

export interface IUserUsecase {
  create(req: Entity.CreateUserReq): Promise<Entity.User>
  login(req: Entity.LoginReq): Promise<Entity.LoginRes | null>
  findList(req: Entity.GetUserReq): Promise<Entity.UserList>
  findById(id: string): Promise<Entity.User | null>
  findByUsername(username: string): Promise<Entity.User | null>
}

export interface IUserRepo {
  create(req: Entity.CreateUserReq): Promise<Entity.User>
  checkExistingUser(username: string, email: string): Promise<boolean>
  findList(req: Entity.GetUserReq): Promise<Entity.UserList>
  findById(id: string): Promise<Entity.User | null>
  findByUsername(username: string): Promise<Entity.User | null>
  findByUsernameForLogin(username: string): Promise<(Entity.User & { password: string }) | null>
}
