import { Hono } from 'hono'

import { createProductRepo } from '@/adapter/secondary/repository/product/product.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createProductUsecase } from '@/modules/product/product.usecase'

import { createProductHandler } from './product.handler'
import * as Schema from './product.schema'

const repo = createProductRepo()
const usecase = createProductUsecase(repo)
const handler = createProductHandler(usecase)

const router = new Hono()

router.post('/', authenticate, validate(Schema.createProductSchema), handler.create)
router.get('/', authenticate, validateQuery(Schema.getProductListSchema), handler.findList)
router.put('/:id', authenticate, validate(Schema.updateProductSchema), handler.update)

export default router
