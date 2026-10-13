import { Hono } from 'hono'

import { createCategoryRepo } from '@/adapter/secondary/repository/category/category.repo'
import { createContactRepo } from '@/adapter/secondary/repository/contact/contact.repo'
import { createCustomerRepo } from '@/adapter/secondary/repository/customer/customer.repo'
import { transactor } from '@/common/executor'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createCategoryUsecase } from '@/modules/category/category.usecase'
import { createContactUsecase } from '@/modules/contact/contact.usecase'
import { createCustomerUsecase } from '@/modules/customer/customer.usecase'

import { createCustomerHandlerDeps } from './customer.handler'
import * as Schema from './customer.schema'

const repo = createCustomerRepo()
const categoryRepo = createCategoryRepo()
const categoryUsecase = createCategoryUsecase(categoryRepo)
const contactRepo = createContactRepo()
const contactUsecase = createContactUsecase(contactRepo)
const usecase = createCustomerUsecase(repo, categoryUsecase, contactUsecase, transactor)
const handler = createCustomerHandlerDeps(usecase)

const router = new Hono()

router.post(
  '/',
  authenticate,
  requirePermission('customers.create'),
  validate(Schema.createCustomerSchema),
  handler.create,
)
router.get(
  '/',
  authenticate,
  requirePermission('customers.view'),
  validateQuery(Schema.getCustomerListSchema),
  handler.findList,
)
router.get('/template', authenticate, requirePermission('customers.view'), handler.downloadTemplate)
router.post(
  '/import/dry-run',
  authenticate,
  requirePermission('customers.create'),
  handler.dryRunImport,
)
router.post('/import', authenticate, requirePermission('customers.create'), handler.executeImport)

router.get('/:id', authenticate, requirePermission('customers.view'), handler.findById)
router.put(
  '/:id',
  authenticate,
  requirePermission('customers.update'),
  validate(Schema.updateCustomerSchema),
  handler.update,
)
router.delete('/:id', authenticate, requirePermission('customers.delete'), handler.delete)

export default router
