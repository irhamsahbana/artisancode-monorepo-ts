import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { verifyWebhookSignature } from '@/adapter/secondary/rest/gowa/verify-webhook'
import { responseSuccess } from '@/common/rest_response'
import { env } from '@/config/env'
import logger from '@/config/logger'
import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

interface GowaMessageWebhookBody {
  event?: string
  payload?: { from?: string; chat_id?: string; body?: string; is_from_me?: boolean }
}

export function createWhatsappHandler(whatsAppLoginUsecase: IWhatsAppLoginUsecase) {
  return {
    status: async (c: Context<AppEnv>) => {
      const data = await getWhatsAppProvider().getConnectionStatus()
      return c.json(responseSuccess(data))
    },

    login: async (c: Context<AppEnv>) => {
      const data = await getWhatsAppProvider().login()
      return c.json(responseSuccess(data))
    },

    logout: async (c: Context<AppEnv>) => {
      await getWhatsAppProvider().logout()
      return c.json(responseSuccess(null, 'WhatsApp device logged out'))
    },

    reconnect: async (c: Context<AppEnv>) => {
      await getWhatsAppProvider().reconnect()
      return c.json(responseSuccess(null, 'Reconnecting WhatsApp device'))
    },

    webhook: async (c: Context<AppEnv>) => {
      const rawBody = await c.req.text()

      if (env.GOWA.WEBHOOK_SECRET) {
        const signature = c.req.header('X-Hub-Signature-256')
        if (!verifyWebhookSignature(env.GOWA.WEBHOOK_SECRET, rawBody, signature)) {
          return c.json(responseSuccess(null), 401)
        }
      } else {
        logger.warn('GOWA_WEBHOOK_SECRET not set — skipping webhook signature verification')
      }

      const body = JSON.parse(rawBody) as GowaMessageWebhookBody
      const payload = body.payload
      const from = payload?.from
      const messageBody = payload?.body

      const isDirectTextMessage =
        body.event === 'message' &&
        payload?.is_from_me === false &&
        typeof from === 'string' &&
        typeof messageBody === 'string' &&
        !payload.chat_id?.endsWith('@g.us')

      if (isDirectTextMessage) {
        const phone = from.split('@')[0] ?? ''
        await whatsAppLoginUsecase.confirmByIncomingMessage(phone, messageBody)
      }

      return c.json(responseSuccess(null))
    },
  }
}
