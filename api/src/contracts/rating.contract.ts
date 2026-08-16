import * as Entity from '@/entities/rating.entity'

export interface IRatingRepo {
  create(req: Entity.CreateCustomerRatingReq): Promise<Entity.CustomerRating>
  findList(req: Entity.GetCustomerRatingReq): Promise<Entity.CustomerRatingList>
}

export interface IRatingUsecase {
  create(req: Entity.CreateCustomerRatingReq): Promise<Entity.CustomerRating>
  findList(req: Entity.GetCustomerRatingReq): Promise<Entity.CustomerRatingList>
}
