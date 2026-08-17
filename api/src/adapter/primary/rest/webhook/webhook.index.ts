import { Hono } from 'hono'

import { authenticate } from '@/common/middlewares/auth.middleware'
import { validateQuery } from '@/common/middlewares/validation.middleware'
import { createPaymentGateway } from '@/integrations'
import { createWebhookModule } from '@/modules/webhook'

import { createWebhookHandler } from './webhook.handler'
import * as Schema from './webhook.schema'

const { usecase } = createWebhookModule(createPaymentGateway())
const handler = createWebhookHandler(usecase)

const router = new Hono()

// Public: DOKU calls this directly, signature-verified inside the usecase
router.post('/notify', handler.notify)

router.get('/', authenticate, validateQuery(Schema.getWebhookLogListSchema), handler.findList)

export default router
