import { getExecutor } from '@/common/executor'
import { customerRatings } from '@/db/schema'
import * as Entity from '@/entities/rating.entity'

import { RatingRepoDeps } from '../rating.repo'

export async function createRating(
  deps: RatingRepoDeps,
  req: Entity.CreateCustomerRatingReq,
): Promise<Entity.CustomerRating> {
  const [row] = await getExecutor()
    .insert(customerRatings)
    .values({
      customerId: req.customerId,
      contactId: req.contactId,
      ratingDate: req.ratingDate,
      paymentScore: String(req.paymentScore),
      relationshipScore: String(req.relationshipScore),
      problemNotes: req.problemNotes,
      riskLevel: req.riskLevel,
      notes: req.notes,
    })
    .returning()
  return deps.toEntity(row)
}
