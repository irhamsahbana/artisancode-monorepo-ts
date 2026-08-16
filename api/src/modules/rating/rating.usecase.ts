import { IRatingRepo, IRatingUsecase } from '@/contracts/rating.contract'

export interface RatingUsecaseDeps {
  repo: IRatingRepo
}

export function createRatingUsecase(repo: IRatingRepo): IRatingUsecase {
  const deps: RatingUsecaseDeps = { repo }

  return {
    create: (req) => deps.repo.create(req),
    findList: (req) => deps.repo.findList(req),
  }
}
