import * as Entity from '@/entities/rating.entity'

import { RatingUsecaseDeps } from '../rating.usecase'

export async function findRatingList(
  deps: RatingUsecaseDeps,
  req: Entity.GetCustomerRatingReq,
): Promise<Entity.CustomerRatingList> {
  return deps.repo.findList(req)
}
