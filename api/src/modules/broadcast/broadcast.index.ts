import { Hono } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'

import { createBroadcastHandler } from './broadcast.handler'
import { createBroadcastRepo } from './broadcast.repo'
import * as Schema from './broadcast.schema'
import { createBroadcastUsecase } from './broadcast.usecase'

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
