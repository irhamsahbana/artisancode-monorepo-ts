import { Hono } from 'hono'

import { createContactRepo } from '@/adapter/secondary/repository/contact/contact.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { validate, validateQuery } from '@/common/middlewares/validation.middleware'
import { createContactUsecase } from '@/modules/contact/contact.usecase'

import { createContactHandlerDeps } from './contact.handler'
import * as Schema from './contact.schema'

const repo = createContactRepo()
const usecase = createContactUsecase(repo)
const handler = createContactHandlerDeps(usecase)

const router = new Hono()

router.post('/', authenticate, validate(Schema.createContactSchema), handler.create)
router.get('/', authenticate, validateQuery(Schema.getContactListSchema), handler.findList)
router.get('/search', authenticate, handler.search)
router.get('/:id', authenticate, handler.findById)
router.put('/:id', authenticate, validate(Schema.updateContactSchema), handler.update)
router.delete('/:id', authenticate, handler.delete)

export default router
