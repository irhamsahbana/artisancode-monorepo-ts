import { Hono } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'

import { createProductHandler } from './product.handler'
import { createProductRepo } from './product.repo'
import * as Schema from './product.schema'
import { createProductUsecase } from './product.usecase'

const repo = createProductRepo()
const usecase = createProductUsecase(repo)
const handler = createProductHandler(usecase)

const router = new Hono()

router.post('/', authenticate, validate(Schema.createProductSchema), handler.create)
router.get('/', authenticate, validateQuery(Schema.getProductListSchema), handler.findList)
router.put('/:id', authenticate, validate(Schema.updateProductSchema), handler.update)

export default router
