import { Hono } from 'hono'

import { createUserRepo } from '@/adapter/secondary/repository/user/user.repo'
import { createWhatsAppLoginRepo } from '@/adapter/secondary/repository/whatsapp_login/whatsapp_login.repo'
import { validate } from '@/common/middlewares/validation.middleware'
import { createWhatsAppLoginUsecase } from '@/modules/whatsapp_login/whatsapp_login.usecase'

import { createWhatsAppLoginHandler } from './whatsapp_login.handler'
import * as Schema from './whatsapp_login.schema'

const whatsAppLoginUsecase = createWhatsAppLoginUsecase(createWhatsAppLoginRepo(), createUserRepo())
const handler = createWhatsAppLoginHandler(whatsAppLoginUsecase)

const router = new Hono()

// Public — unauthenticated by design, this IS the login flow.
router.post('/', validate(Schema.requestWhatsAppLoginSchema), handler.request)
router.get('/:id/status', handler.status)

export default router
