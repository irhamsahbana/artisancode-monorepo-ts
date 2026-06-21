import { Hono } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'

import { createCustomerHandlerDeps } from './customer.handler'
import { createCustomerRepo } from './customer.repo'
import * as Schema from './customer.schema'
import { createCustomerUsecase } from './customer.usecase'

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
