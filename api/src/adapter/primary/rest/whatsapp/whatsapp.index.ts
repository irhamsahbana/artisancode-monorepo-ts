import { Hono } from 'hono'

import { createBusinessProfileRepo } from '@/adapter/secondary/repository/business_profile/business_profile.repo'
import { createUserRepo } from '@/adapter/secondary/repository/user/user.repo'
import { createWhatsAppLoginRepo } from '@/adapter/secondary/repository/whatsapp_login/whatsapp_login.repo'
import { authenticate } from '@/common/middlewares/auth.middleware'
import { createWhatsAppLoginUsecase } from '@/modules/whatsapp_login/whatsapp_login.usecase'

import { createWhatsappHandler } from './whatsapp.handler'

const businessProfileRepo = createBusinessProfileRepo()
const whatsAppLoginUsecase = createWhatsAppLoginUsecase(createWhatsAppLoginRepo(), createUserRepo())
const handler = createWhatsappHandler(whatsAppLoginUsecase, businessProfileRepo)

const router = new Hono()
router.get('/devices', authenticate, handler.listDevices)
router.post('/devices', authenticate, handler.addDevice)
router.delete('/devices/:id', authenticate, handler.removeDevice)
router.post('/devices/:id/primary', authenticate, handler.setPrimaryDevice)
router.post('/devices/:id/login', authenticate, handler.login)
router.post('/devices/:id/logout', authenticate, handler.logout)
router.post('/devices/:id/reconnect', authenticate, handler.reconnect)
// Public: called by the gowa server, signature-verified inside the handler
router.post('/webhook', handler.webhook)

export default router
