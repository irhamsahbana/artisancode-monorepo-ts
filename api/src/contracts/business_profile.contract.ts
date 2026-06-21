import * as Entity from '@/entities/business_profile.entity'

export interface IBusinessProfileRepo {
  findByCompanyId(companyId: string): Promise<Entity.BusinessProfile | null>
  update(req: Entity.UpdateBusinessProfileReq): Promise<Entity.BusinessProfile | null>
}

export interface IBusinessProfileUsecase {
  findByCompanyId(companyId: string): Promise<Entity.BusinessProfile | null>
  update(req: Entity.UpdateBusinessProfileReq): Promise<Entity.BusinessProfile | null>
}
