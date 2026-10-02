import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { verifyWebhookSignature } from '@/adapter/secondary/rest/gowa/verify-webhook'
import { responseSuccess } from '@/common/rest_response'
import { env } from '@/config/env'
import logger from '@/config/logger'
import { IBusinessProfileRepo } from '@/contracts/business_profile.contract'
import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

interface GowaMessageWebhookBody {
  event?: string
  payload?: { from?: string; chat_id?: string; body?: string; is_from_me?: boolean }
}

export function createWhatsappHandler(
  whatsAppLoginUsecase: IWhatsAppLoginUsecase,
  businessProfileRepo: IBusinessProfileRepo,
) {
  return {
    listDevices: async (c: Context<AppEnv>) => {
      const data = await getWhatsAppProvider().listDevices()
      return c.json(responseSuccess(data))
    },

    addDevice: async (c: Context<AppEnv>) => {
      const data = await getWhatsAppProvider().addDevice()
      return c.json(responseSuccess(data))
    },

    removeDevice: async (c: Context<AppEnv>) => {
      const deviceId = c.req.param('id') ?? ''
      await getWhatsAppProvider().removeDevice(deviceId)
      return c.json(responseSuccess(null, 'Device dihapus'))
    },

    setPrimaryDevice: async (c: Context<AppEnv>) => {
      const deviceId = c.req.param('id') ?? ''
      await businessProfileRepo.update({ whatsappDeviceId: deviceId })
      return c.json(responseSuccess(null, 'Device utama diperbarui'))
    },

    login: async (c: Context<AppEnv>) => {
      const deviceId = c.req.param('id') ?? ''
      const data = await getWhatsAppProvider().login(deviceId)
      return c.json(responseSuccess(data))
    },

    logout: async (c: Context<AppEnv>) => {
      const deviceId = c.req.param('id') ?? ''
      await getWhatsAppProvider().logout(deviceId)
      return c.json(responseSuccess(null, 'WhatsApp device logged out'))
    },

    reconnect: async (c: Context<AppEnv>) => {
      const deviceId = c.req.param('id') ?? ''
      await getWhatsAppProvider().reconnect(deviceId)
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
