import { Hono } from 'hono'

import { createBusinessProfileRepo } from '@/adapter/secondary/repository/business_profile/business_profile.repo'
import { createUserRepo } from '@/adapter/secondary/repository/user/user.repo'
import { createWhatsAppLoginRepo } from '@/adapter/secondary/repository/whatsapp_login/whatsapp_login.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { createWhatsAppLoginUsecase } from '@/modules/whatsapp_login/whatsapp_login.usecase'

import { createWhatsappHandler } from './whatsapp.handler'

const whatsAppLoginUsecase = createWhatsAppLoginUsecase(
  createWhatsAppLoginRepo(),
  createUserRepo(),
  createBusinessProfileRepo(),
)
const handler = createWhatsappHandler(whatsAppLoginUsecase)

const router = new Hono()
router.get('/status', authenticate, handler.status)
router.get('/login', authenticate, handler.login)
router.post('/logout', authenticate, handler.logout)
router.post('/reconnect', authenticate, handler.reconnect)
// Public: called by the gowa server, signature-verified inside the handler
router.post('/webhook', handler.webhook)

export default router
