import { Hono } from 'hono'

import { createUserRepo } from '@/adapter/secondary/repository/user/user.repo'
import { createWhatsAppLoginRepo } from '@/adapter/secondary/repository/whatsapp_login/whatsapp_login.repo'
import { RateLimitKey, rateLimit } from '@/common/middlewares/rate_limit.middleware'
import { validate } from '@/common/middlewares/validation.middleware'
import { createWhatsAppLoginUsecase } from '@/modules/whatsapp_login/whatsapp_login.usecase'

import { createWhatsAppLoginHandler } from './whatsapp_login.handler'
import * as Schema from './whatsapp_login.schema'

const whatsAppLoginUsecase = createWhatsAppLoginUsecase(createWhatsAppLoginRepo(), createUserRepo())
const handler = createWhatsAppLoginHandler(whatsAppLoginUsecase)

const router = new Hono()

// Public — unauthenticated by design, this IS the login flow. Rate-limited
// per IP since both routes are unauthenticated: the POST writes to the DB
// and looks up users by phone on every call, the GET is polled every ~3s by
// a legitimate client for up to the request's 5-minute TTL.
router.post(
  '/',
  rateLimit({ windowMs: 5 * 60 * 1000, max: 5, keyPrefix: RateLimitKey.WA_LOGIN_REQUEST }),
  validate(Schema.requestWhatsAppLoginSchema),
  handler.request,
)
router.get(
  '/:id/status',
  rateLimit({ windowMs: 60 * 1000, max: 60, keyPrefix: RateLimitKey.WA_LOGIN_STATUS }),
  handler.status,
)

export default router
