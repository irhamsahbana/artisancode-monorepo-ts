import * as Entity from '@/entities/role.entity'

export interface IRoleAndPermissionUsecase {
  // Role
  createRole(req: Entity.CreateRoleReq): Promise<Entity.Role>
  findRoleList(req: Entity.GetRoleReq): Promise<Entity.RoleList>
  findRoleById(id: string): Promise<Entity.Role | null>
  updateRole(req: Entity.UpdateRoleReq): Promise<Entity.Role>
  deleteRole(id: string): Promise<void>

  // Permission
  findPermissionList(req: Entity.GetPermissionReq): Promise<Entity.PermissionList>
  getPermissionNamesByRoleId(roleId: string): Promise<string[]>
}

export interface IRoleAndPermissionRepo {
  // Role
  createRole(req: Entity.CreateRoleReq): Promise<Entity.Role>
  findRoleList(req: Entity.GetRoleReq): Promise<Entity.RoleList>
  findRoleById(id: string): Promise<Entity.Role | null>
  updateRole(req: Entity.UpdateRoleReq): Promise<Entity.Role>
  deleteRole(id: string): Promise<void>

  // Permission
  findPermissionList(req: Entity.GetPermissionReq): Promise<Entity.PermissionList>
  findPermissionNamesByRoleId(roleId: string): Promise<string[]>
}
