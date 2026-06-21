import { Hono } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'

import { createMasterHandlerDeps } from './master.handler'
import { createMasterRepo } from './master.repo'
import * as Schema from './master.schema'
import { createMasterUsecase } from './master.usecase'

const repo = createMasterRepo()
const usecase = createMasterUsecase(repo)
const handler = createMasterHandlerDeps(usecase)

const router = new Hono()

// Routes use /:type slug to differentiate master data categories
router.post('/:type', authenticate, validate(Schema.createMasterItemSchema), handler.create)
router.get('/:type', authenticate, validateQuery(Schema.getMasterItemListSchema), handler.findList)
router.get('/:type/:id', authenticate, handler.findById)
router.put('/:type/:id', authenticate, validate(Schema.updateMasterItemSchema), handler.update)
router.delete('/:type/:id', authenticate, handler.delete)

export default router
