import * as Entity from '@/entities/rating.entity'

import { RatingUsecaseDeps } from '../rating.usecase'

export async function createRating(
  deps: RatingUsecaseDeps,
  req: Entity.CreateCustomerRatingReq,
): Promise<Entity.CustomerRating> {
  return deps.repo.create(req)
}
