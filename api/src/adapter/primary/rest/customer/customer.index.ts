import { Hono } from 'hono'

import { createCustomerRepo } from '@/adapter/secondary/repository/customer/customer.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createCustomerUsecase } from '@/modules/customer/customer.usecase'

import { createCustomerHandlerDeps } from './customer.handler'
import * as Schema from './customer.schema'

const repo = createCustomerRepo()
const usecase = createCustomerUsecase(repo)
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
