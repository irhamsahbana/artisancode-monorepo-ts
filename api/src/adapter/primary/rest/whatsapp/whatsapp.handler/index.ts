import { withSpan } from '@artisancode/observability'
import { AppEnv } from '@artisancode/types'
import { Context } from 'hono'

import { IBusinessProfileRepo } from '@/contracts/business_profile.contract'
import { IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'

import { addDeviceHandler as makeAddDevice } from './add-device'
import { listDevicesHandler as makeListDevices } from './list-devices'
import { loginDeviceHandler as makeLogin } from './login'
import { logoutDeviceHandler as makeLogout } from './logout'
import { qrImageHandler as makeQrImage } from './qr-image'
import { reconnectDeviceHandler as makeReconnect } from './reconnect'
import { removeDeviceHandler as makeRemoveDevice } from './remove-device'
import { setPrimaryDeviceHandler as makeSetPrimaryDevice } from './set-primary-device'
import { whatsappWebhookHandler as makeWebhook } from './webhook'

export function createWhatsappHandlerDeps(
  whatsAppLoginUsecase: IWhatsAppLoginUsecase,
  businessProfileRepo: IBusinessProfileRepo,
) {
  const handlers = {
    listDevices: makeListDevices(),
    addDevice: makeAddDevice(),
    removeDevice: makeRemoveDevice(),
    setPrimaryDevice: makeSetPrimaryDevice(businessProfileRepo),
    login: makeLogin(),
    logout: makeLogout(),
    reconnect: makeReconnect(),
    qrImage: makeQrImage(),
    webhook: makeWebhook(whatsAppLoginUsecase),
  }

  return {
    listDevices: (c: Context<AppEnv>) =>
      withSpan('WhatsAppHandler.listDevices', () => handlers.listDevices(c)),
    addDevice: (c: Context<AppEnv>) =>
      withSpan('WhatsAppHandler.addDevice', () => handlers.addDevice(c)),
    removeDevice: (c: Context<AppEnv>) =>
      withSpan('WhatsAppHandler.removeDevice', () => handlers.removeDevice(c)),
    setPrimaryDevice: (c: Context<AppEnv>) =>
      withSpan('WhatsAppHandler.setPrimaryDevice', () => handlers.setPrimaryDevice(c)),
    login: (c: Context<AppEnv>) => withSpan('WhatsAppHandler.login', () => handlers.login(c)),
    logout: (c: Context<AppEnv>) => withSpan('WhatsAppHandler.logout', () => handlers.logout(c)),
    reconnect: (c: Context<AppEnv>) =>
      withSpan('WhatsAppHandler.reconnect', () => handlers.reconnect(c)),
    qrImage: (c: Context<AppEnv>) => withSpan('WhatsAppHandler.qrImage', () => handlers.qrImage(c)),
    webhook: (c: Context<AppEnv>) => withSpan('WhatsAppHandler.webhook', () => handlers.webhook(c)),
  }
}

export { createWhatsappHandlerDeps as createWhatsappHandler }
export default createWhatsappHandlerDeps
