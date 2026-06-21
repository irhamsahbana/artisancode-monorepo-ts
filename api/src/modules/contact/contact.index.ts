import { Hono } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'

import { createContactHandlerDeps } from './contact.handler'
import { createContactRepo } from './contact.repo'
import * as Schema from './contact.schema'
import { createContactUsecase } from './contact.usecase'

const repo = createContactRepo()
const usecase = createContactUsecase(repo)
const handler = createContactHandlerDeps(usecase)

const router = new Hono()

router.post('/', authenticate, validate(Schema.createContactSchema), handler.create)
router.get('/', authenticate, validateQuery(Schema.getContactListSchema), handler.findList)
router.get('/:id', authenticate, handler.findById)
router.put('/:id', authenticate, validate(Schema.updateContactSchema), handler.update)
router.delete('/:id', authenticate, handler.delete)

export default router
