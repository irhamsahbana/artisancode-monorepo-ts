import { Hono } from 'hono'

import { createBroadcastRepo } from '@/adapter/secondary/repository/broadcast/broadcast.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
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
  requirePermission('broadcast_templates.create'),
  validate(Schema.createBroadcastTemplateSchema),
  handler.createTemplate,
)
router.get(
  '/',
  authenticate,
  requirePermission('broadcast_templates.view'),
  validateQuery(Schema.getBroadcastListSchema),
  handler.findTemplateList,
)
router.get('/logs', authenticate, requirePermission('broadcast_logs.view'), handler.findLogs)
router.get(
  '/:id/logs',
  authenticate,
  requirePermission('broadcast_logs.view'),
  handler.findLogsByTemplateId,
)
router.post(
  '/send',
  authenticate,
  requirePermission('broadcast_logs.create'),
  validate(Schema.sendBroadcastSchema),
  handler.send,
)

export default router
