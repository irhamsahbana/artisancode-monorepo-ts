import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/whatsapp_login.entity'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

import { formatConfirmMessage, generateConfirmToken, jidToPhone, REQUEST_TTL_MS } from './helpers'

import type { WhatsAppLoginUsecaseDeps } from '../whatsapp_login.usecase'

export async function requestWhatsAppLogin(
  deps: WhatsAppLoginUsecaseDeps,
  req: Entity.RequestWhatsAppLoginReq,
): Promise<Entity.RequestWhatsAppLoginRes> {
  const user = await deps.userRepo.findByPhone(req.phone)
  const confirmToken = generateConfirmToken()

  // Always creates a row and returns the same success shape whether or
  // not the phone matches a user — never reveal via the response which
  // phone numbers are registered.
  const row = await deps.repo.create({
    phone: req.phone,
    userId: user?.id ?? null,
    confirmToken,
    expiresAt: new Date(Date.now() + REQUEST_TTL_MS),
  })

  const devices = await getWhatsAppProvider().listDevices()
  const primary =
    devices.find((d) => d.isPrimary && d.isLoggedIn) ||
    (devices.length === 1 && devices[0]?.isLoggedIn ? devices[0] : undefined)
  if (!primary?.jid) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      'Device WhatsApp utama belum terhubung — cek Settings > Koneksi WhatsApp',
    )
  }

  return {
    requestId: row.id,
    confirmMessage: formatConfirmMessage(confirmToken),
    businessWhatsapp: jidToPhone(primary.jid),
  }
}
