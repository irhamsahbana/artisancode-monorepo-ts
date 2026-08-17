import { Hono } from 'hono'

import { createContactRepo } from '@/adapter/secondary/repository/contact/contact.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createContactUsecase } from '@/modules/contact/contact.usecase'

import { createContactHandlerDeps } from './contact.handler'
import * as Schema from './contact.schema'

const repo = createContactRepo()
const usecase = createContactUsecase(repo)
const handler = createContactHandlerDeps(usecase)

const router = new Hono()

router.post(
  '/',
  authenticate,
  requirePermission('contacts.create'),
  validate(Schema.createContactSchema),
  handler.create,
)
router.get(
  '/',
  authenticate,
  requirePermission('contacts.view'),
  validateQuery(Schema.getContactListSchema),
  handler.findList,
)
router.get('/search', authenticate, requirePermission('contacts.view'), handler.search)
router.get(
  '/persons',
  authenticate,
  requirePermission('contacts.view'),
  validateQuery(Schema.searchContactPersonsSchema),
  handler.searchPersons,
)
router.get('/:id', authenticate, requirePermission('contacts.view'), handler.findById)
router.put(
  '/:id',
  authenticate,
  requirePermission('contacts.update'),
  validate(Schema.updateContactSchema),
  handler.update,
)
router.delete('/:id', authenticate, requirePermission('contacts.delete'), handler.delete)

export default router
