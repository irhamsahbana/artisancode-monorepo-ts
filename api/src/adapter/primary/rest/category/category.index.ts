import { Hono } from 'hono'

import { createCategoryRepo } from '@/adapter/secondary/repository/category/category.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { requirePermission } from '@/common/middlewares/permission.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createCategoryUsecase } from '@/modules/category/category.usecase'

import { createCategoryHandlerDeps } from './category.handler'
import * as Schema from './category.schema'

const repo = createCategoryRepo()
const usecase = createCategoryUsecase(repo)
const handler = createCategoryHandlerDeps(usecase)

const router = new Hono()

router.post(
  '/',
  authenticate,
  requirePermission('categories.create'),
  validate(Schema.createCategorySchema),
  handler.create,
)
router.put(
  '/:id',
  authenticate,
  requirePermission('categories.update'),
  validate(Schema.updateCategorySchema),
  handler.update,
)
router.delete('/:id', authenticate, requirePermission('categories.delete'), handler.delete)
router.get('/:id', authenticate, requirePermission('categories.view'), handler.findById)
router.get(
  '/',
  authenticate,
  requirePermission('categories.view'),
  validateQuery(Schema.getCategoryListSchema),
  handler.findList,
)

export default router
