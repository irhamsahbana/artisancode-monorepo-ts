import { Hono } from 'hono'

import { createBusinessProfileRepo } from '@/adapter/secondary/repository/business_profile/business_profile.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate } from '@/common/middlewares/validation.middleware'
import { createBusinessProfileUsecase } from '@/modules/business_profile/business_profile.usecase'

import { createBusinessProfileHandler } from './business_profile.handler'
import * as Schema from './business_profile.schema'

const repo = createBusinessProfileRepo()
const usecase = createBusinessProfileUsecase(repo)
const handler = createBusinessProfileHandler(usecase)

const router = new Hono()

router.get('/', authenticate, requirePermission('business_profiles.view'), handler.find)

router.patch(
  '/',
  authenticate,
  requirePermission('business_profiles.update'),
  validate(Schema.updateBusinessProfileSchema),
  handler.update,
)

export default router
