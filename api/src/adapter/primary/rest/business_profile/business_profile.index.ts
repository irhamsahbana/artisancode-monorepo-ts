import { AppEnv } from '@artisancode/types'
import { Hono } from 'hono'
import { Context } from 'hono'

import { createBusinessProfileRepo } from '@/adapter/secondary/repository/business_profile/business_profile.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate } from '@/common/middlewares/validation.middleware'
import { responseSuccess } from '@/common/rest_response'
import * as Entity from '@/entities/business_profile.entity'
import { createBusinessProfileUsecase } from '@/modules/business_profile/business_profile.usecase'

import * as Schema from './business_profile.schema'

const repo = createBusinessProfileRepo()
const usecase = createBusinessProfileUsecase(repo)

const router = new Hono()

router.get(
  '/',
  authenticate,
  requirePermission('business_profiles.view'),
  async (c: Context<AppEnv>) => {
    const data = await usecase.find()
    return c.json(responseSuccess(data))
  },
)

router.patch(
  '/',
  authenticate,
  requirePermission('business_profiles.update'),
  validate(Schema.updateBusinessProfileSchema),
  async (c: Context<AppEnv>) => {
    const body = c.get('body')

    const payload: Entity.UpdateBusinessProfileReq = {
      name: body.name,
      businessType: body.business_type,
      phone: body.phone,
      countryCode: body.country_code,
      email: body.email,
      address: body.address,
    }

    const data = await usecase.update(payload)
    return c.json(responseSuccess(data, 'Business profile updated successfully'))
  },
)

export default router
