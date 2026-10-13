import { Hono } from 'hono'

import { createBirthdayGreetingRepo } from '@/adapter/secondary/repository/birthday_greeting/birthday_greeting.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate } from '@/common/middlewares/validation.middleware'
import { createBirthdayGreetingUsecase } from '@/modules/birthday_greeting/birthday_greeting.usecase'

import { createBirthdayGreetingHandler } from './birthday_greeting.handler'
import * as Schema from './birthday_greeting.schema'

const repo = createBirthdayGreetingRepo()
const usecase = createBirthdayGreetingUsecase(repo)
const handler = createBirthdayGreetingHandler(usecase)

const router = new Hono()

router.get(
  '/',
  authenticate,
  requirePermission('birthday_greeting.view'),
  handler.find,
)

router.patch(
  '/',
  authenticate,
  requirePermission('birthday_greeting.update'),
  validate(Schema.updateBirthdayGreetingSchema),
  handler.update,
)

router.get(
  '/logs',
  authenticate,
  requirePermission('birthday_greeting.view'),
  handler.findLogs,
)

export default router
