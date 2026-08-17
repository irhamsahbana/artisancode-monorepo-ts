import { AppEnv } from '@artisancode/types'
import { Hono } from 'hono'
import { Context } from 'hono'

import { createBirthdayGreetingRepo } from '@/adapter/secondary/repository/birthday_greeting/birthday_greeting.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate } from '@/common/middlewares/validation.middleware'
import { responseSuccess } from '@/common/rest_response'
import { createBirthdayGreetingUsecase } from '@/modules/birthday_greeting/birthday_greeting.usecase'

import * as Schema from './birthday_greeting.schema'

const repo = createBirthdayGreetingRepo()
const usecase = createBirthdayGreetingUsecase(repo)

const router = new Hono()

router.get(
  '/',
  authenticate,
  requirePermission('birthday_greeting.view'),
  async (c: Context<AppEnv>) => {
    const data = await usecase.find()
    return c.json(responseSuccess(data))
  },
)

router.patch(
  '/',
  authenticate,
  requirePermission('birthday_greeting.update'),
  validate(Schema.updateBirthdayGreetingSchema),
  async (c: Context<AppEnv>) => {
    const data = await usecase.update(c.get('body'))
    return c.json(responseSuccess(data, 'Birthday greeting settings updated successfully'))
  },
)

router.get(
  '/logs',
  authenticate,
  requirePermission('birthday_greeting.view'),
  async (c: Context<AppEnv>) => {
    const data = await usecase.findLogs()
    return c.json(responseSuccess(data))
  },
)

export default router
