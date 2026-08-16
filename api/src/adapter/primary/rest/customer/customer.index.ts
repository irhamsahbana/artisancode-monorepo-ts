import { Hono } from 'hono'

import { createCustomerRepo } from '@/adapter/secondary/repository/customer/customer.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createCustomerUsecase } from '@/modules/customer/customer.usecase'

import { createCustomerHandlerDeps } from './customer.handler'
import * as Schema from './customer.schema'

const repo = createCustomerRepo()
const usecase = createCustomerUsecase(repo)
const handler = createCustomerHandlerDeps(usecase)

const router = new Hono()

router.post('/', authenticate, validate(Schema.createCustomerSchema), handler.create)
router.get('/', authenticate, validateQuery(Schema.getCustomerListSchema), handler.findList)
router.get('/:id', authenticate, handler.findById)
router.put('/:id', authenticate, validate(Schema.updateCustomerSchema), handler.update)
router.delete('/:id', authenticate, handler.delete)

export default router
