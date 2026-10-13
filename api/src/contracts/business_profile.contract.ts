import * as Entity from '@/entities/business_profile.entity'

export interface IBusinessProfileRepo {
  find(): Promise<Entity.BusinessProfile | null>
  update(req: Entity.UpdateBusinessProfileReq): Promise<Entity.BusinessProfile | null>
}

export interface IBusinessProfileUsecase {
  find(): Promise<Entity.BusinessProfile>
  update(req: Entity.UpdateBusinessProfileReq): Promise<Entity.BusinessProfile>
}
