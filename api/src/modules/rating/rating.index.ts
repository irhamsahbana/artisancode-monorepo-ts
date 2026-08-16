import { Hono } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'

import { createRatingHandler } from './rating.handler'
import { createRatingRepo } from './rating.repo'
import * as Schema from './rating.schema'
import { createRatingUsecase } from './rating.usecase'

const repo = createRatingRepo()
const usecase = createRatingUsecase(repo)
const handler = createRatingHandler(usecase)

const router = new Hono()

router.get('/', authenticate, validateQuery(Schema.getCustomerRatingListSchema), handler.findList)
router.post('/', authenticate, validate(Schema.createCustomerRatingSchema), handler.create)

export default router
