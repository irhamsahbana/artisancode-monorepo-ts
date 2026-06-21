import { AppEnv } from '@artisancode/types'
import { Hono } from 'hono'
import { Context } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate } from '@/common/middlewares/validation.middleware'
import { responseSuccess } from '@/common/rest_response'
import { getUserContext } from '@/common/store/user-context'
import * as Entity from '@/entities/business_profile.entity'

import { createBusinessProfileRepo } from './business_profile.repo'
import * as Schema from './business_profile.schema'
import { createBusinessProfileUsecase } from './business_profile.usecase'

const repo = createBusinessProfileRepo()
const usecase = createBusinessProfileUsecase(repo)

const router = new Hono()

router.get('/', authenticate, async (c: Context<AppEnv>) => {
  const user = getUserContext()
  const data = await usecase.findByCompanyId(user?.company_id || '')
  return c.json(responseSuccess(data))
})

router.patch(
  '/',
  authenticate,
  validate(Schema.updateBusinessProfileSchema),
  async (c: Context<AppEnv>) => {
    const body = c.get('body')
    const user = getUserContext()

    const payload: Entity.UpdateBusinessProfileReq = {
      company_id: user?.company_id || '',
      name: body.name,
      businessType: body.business_type,
      phone: body.phone,
      email: body.email,
      address: body.address,
    }

    const data = await usecase.update(payload)
    return c.json(responseSuccess(data, 'Business profile updated successfully'))
  },
)

export default router
