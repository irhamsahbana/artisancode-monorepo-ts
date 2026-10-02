import { AppError, ErrorCode } from '@artisancode/types'

import { createBusinessProfileRepo } from '@/adapter/secondary/repository/business_profile/business_profile.repo'
import { env } from '@/config/env'
import logger from '@/config/logger'
import {
  IWhatsAppProvider,
  SendChatPresenceReq,
  SendWhatsAppTextReq,
  SendWhatsAppTextRes,
  WhatsAppConnectionStatus,
  WhatsAppDevice,
  WhatsAppLoginRes,
} from '@/contracts/integration/whatsapp.contract'

import { createGowaClientConfig, GowaClientConfig } from './client'
import { createDevice } from './create-device'
import { deleteDevice } from './delete-device'
import { getStatus } from './get-status'
import { listDeviceIds } from './list-devices'
import { login } from './login'
import { logout } from './logout'
import { reconnect } from './reconnect'
import { sendChatPresence } from './send-chat-presence'
import { sendMessage } from './send-message'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Best-effort: a failed typing indicator should never block the real send.
const presenceBestEffort = (p: Promise<void>) =>
  p.catch((err) => logger.warn('Gowa chat-presence failed', { error: String(err) }))

export class GowaIntegration implements IWhatsAppProvider {
  readonly name = 'gowa'
  private config: GowaClientConfig
  private businessProfileRepo = createBusinessProfileRepo()

  constructor() {
    this.config = createGowaClientConfig()
  }

  private async getPrimaryDeviceId(): Promise<string> {
    const profile = await this.businessProfileRepo.find()
    if (!profile?.whatsappDeviceId) {
      throw new AppError(
        ErrorCode.NOT_IMPLEMENTED,
        'Belum ada device WhatsApp utama — pilih satu di Settings > Koneksi WhatsApp',
      )
    }
    return profile.whatsappDeviceId
  }

  async sendTextMessage(req: SendWhatsAppTextReq): Promise<SendWhatsAppTextRes> {
    const deviceId = await this.getPrimaryDeviceId()

    // ponytail: typing indicator before the real send makes the traffic look
    // human, not scripted — best-effort, never blocks the actual message.
    const { TYPING_DELAY_MIN_MS, TYPING_DELAY_MAX_MS } = env.WHATSAPP
    await presenceBestEffort(
      sendChatPresence(this.config, deviceId, { to: req.to, action: 'start' }),
    )
    await sleep(TYPING_DELAY_MIN_MS + Math.random() * (TYPING_DELAY_MAX_MS - TYPING_DELAY_MIN_MS))

    const res = await sendMessage(this.config, deviceId, req)

    await presenceBestEffort(
      sendChatPresence(this.config, deviceId, { to: req.to, action: 'stop' }),
    )
    return res
  }

  async sendChatPresence(req: SendChatPresenceReq): Promise<void> {
    const deviceId = await this.getPrimaryDeviceId()
    return sendChatPresence(this.config, deviceId, req)
  }

  async listDevices(): Promise<WhatsAppDevice[]> {
    const [ids, profile] = await Promise.all([
      listDeviceIds(this.config),
      this.businessProfileRepo.find(),
    ])

    // Self-heals the single-device case: with nothing else to choose from,
    // there's no decision for an admin to make — just use it.
    let primaryDeviceId = profile?.whatsappDeviceId
    if (!primaryDeviceId && ids.length === 1) {
      primaryDeviceId = ids[0]
      await this.businessProfileRepo.update({ whatsappDeviceId: primaryDeviceId })
    }

    return Promise.all(
      ids.map(async (id) => ({
        id,
        ...(await getStatus(this.config, id)),
        isPrimary: id === primaryDeviceId,
      })),
    )
  }

  async addDevice(): Promise<WhatsAppDevice> {
    const id = await createDevice(this.config)
    return { id, ...(await getStatus(this.config, id)), isPrimary: false }
  }

  async removeDevice(deviceId: string): Promise<void> {
    // Best-effort: unlink from the phone's "Linked Devices" before purging the
    // record, so deleting a connected device doesn't leave a stale session
    // behind. Ignored if it's already logged out.
    await logout(this.config, deviceId).catch((err) =>
      logger.warn('Gowa logout-before-delete failed', { deviceId, error: String(err) }),
    )
    await deleteDevice(this.config, deviceId)

    const profile = await this.businessProfileRepo.find()
    if (profile?.whatsappDeviceId !== deviceId) return

    // The primary device is gone — hand the role to another connected
    // device if one exists, so broadcasts/login OTP keep working without
    // a manual "Jadikan Utama" click.
    const remainingIds = await listDeviceIds(this.config)
    const remaining = await Promise.all(
      remainingIds.map(async (id) => ({ id, ...(await getStatus(this.config, id)) })),
    )
    const nextPrimaryId = remaining.find((d) => d.isLoggedIn)?.id ?? null
    await this.businessProfileRepo.update({ whatsappDeviceId: nextPrimaryId })
  }

  getConnectionStatus(deviceId: string): Promise<WhatsAppConnectionStatus> {
    return getStatus(this.config, deviceId)
  }

  login(deviceId: string): Promise<WhatsAppLoginRes> {
    return login(this.config, deviceId)
  }

  logout(deviceId: string): Promise<void> {
    return logout(this.config, deviceId)
  }

  reconnect(deviceId: string): Promise<void> {
    return reconnect(this.config, deviceId)
  }
}
