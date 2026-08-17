import { Hono } from 'hono'

import { createRatingRepo } from '@/adapter/secondary/repository/rating/rating.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createRatingUsecase } from '@/modules/rating/rating.usecase'

import { createRatingHandler } from './rating.handler'
import * as Schema from './rating.schema'

const repo = createRatingRepo()
const usecase = createRatingUsecase(repo)
const handler = createRatingHandler(usecase)

const router = new Hono()

router.get(
  '/',
  authenticate,
  requirePermission('customer_ratings.view'),
  validateQuery(Schema.getCustomerRatingListSchema),
  handler.findList,
)
router.post(
  '/',
  authenticate,
  requirePermission('customer_ratings.create'),
  validate(Schema.createCustomerRatingSchema),
  handler.create,
)

export default router
