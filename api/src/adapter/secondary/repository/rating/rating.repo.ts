import { IRatingRepo } from '@/contracts/rating.contract'
import { customerRatings } from '@/db/schema'
import * as Entity from '@/entities/rating.entity'

import { createRating } from './rating.repo/create'
import { findRatingList } from './rating.repo/find-list'

export interface RatingRepoDeps {
  toEntity: (data: typeof customerRatings.$inferSelect) => Entity.CustomerRating
}

function toEntity(data: typeof customerRatings.$inferSelect): Entity.CustomerRating {
  return {
    id: data.id,
    customerId: data.customerId,
    contactId: data.contactId,
    ratingDate: data.ratingDate,
    paymentScore: Number(data.paymentScore),
    relationshipScore: Number(data.relationshipScore),
    problemNotes: data.problemNotes,
    riskLevel: data.riskLevel,
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export function createRatingRepo(): IRatingRepo {
  const deps: RatingRepoDeps = { toEntity }

  return {
    create: (req) => createRating(deps, req),
    findList: (req) => findRatingList(deps, req),
  }
}

export default createRatingRepo
