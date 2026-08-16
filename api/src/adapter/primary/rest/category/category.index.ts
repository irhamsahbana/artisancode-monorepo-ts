import { Hono } from 'hono'

import { createCategoryRepo } from '@/adapter/secondary/repository/category/category.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createCategoryUsecase } from '@/modules/category/category.usecase'

import { createCategoryHandlerDeps } from './category.handler'
import * as Schema from './category.schema'

const repo = createCategoryRepo()
const usecase = createCategoryUsecase(repo)
const handler = createCategoryHandlerDeps(usecase)

const router = new Hono()

router.post('/', authenticate, validate(Schema.createCategorySchema), handler.create)
router.put('/:id', authenticate, validate(Schema.updateCategorySchema), handler.update)
router.delete('/:id', authenticate, handler.delete)
router.get('/:id', authenticate, handler.findById)
router.get('/', authenticate, validateQuery(Schema.getCategoryListSchema), handler.findList)

export default router
