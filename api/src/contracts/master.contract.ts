import * as Entity from '@/entities/master.entity'

export interface IMasterRepo {
  create(req: Entity.CreateMasterItemReq): Promise<Entity.MasterItem>
  findById(id: string, companyId: string): Promise<Entity.MasterItem | null>
  findList(req: Entity.GetMasterItemReq): Promise<Entity.MasterItemList>
  update(req: Entity.UpdateMasterItemReq): Promise<Entity.MasterItem | null>
  delete(id: string, companyId: string): Promise<void>
}

export interface IMasterUsecase {
  create(req: Entity.CreateMasterItemReq): Promise<Entity.MasterItem>
  findById(id: string, companyId: string): Promise<Entity.MasterItem | null>
  findList(req: Entity.GetMasterItemReq): Promise<Entity.MasterItemList>
  update(req: Entity.UpdateMasterItemReq): Promise<Entity.MasterItem | null>
  delete(id: string, companyId: string): Promise<void>
}
