import { IRatingRepo, IRatingUsecase } from '@/contracts/rating.contract'

import { createRating } from './rating.usecase/create'
import { findRatingList } from './rating.usecase/find-list'

export interface RatingUsecaseDeps {
  repo: IRatingRepo
}

export function createRatingUsecase(repo: IRatingRepo): IRatingUsecase {
  const deps: RatingUsecaseDeps = { repo }

  return {
    create: (req) => createRating(deps, req),
    findList: (req) => findRatingList(deps, req),
  }
}

export default createRatingUsecase
