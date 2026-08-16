import { Hono } from 'hono'

import { createBroadcastRepo } from '@/adapter/secondary/repository/broadcast/broadcast.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createBroadcastUsecase } from '@/modules/broadcast/broadcast.usecase'

import { createBroadcastHandler } from './broadcast.handler'
import * as Schema from './broadcast.schema'

const repo = createBroadcastRepo()
const usecase = createBroadcastUsecase(repo)
const handler = createBroadcastHandler(usecase)

const router = new Hono()

router.post(
  '/',
  authenticate,
  validate(Schema.createBroadcastTemplateSchema),
  handler.createTemplate,
)
router.get(
  '/',
  authenticate,
  validateQuery(Schema.getBroadcastListSchema),
  handler.findTemplateList,
)
router.get('/logs', authenticate, handler.findLogs)
router.get('/:id/logs', authenticate, handler.findLogsByTemplateId)
router.post('/send', authenticate, validate(Schema.sendBroadcastSchema), handler.send)

export default router
