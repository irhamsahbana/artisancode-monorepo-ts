import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/whatsapp_login.entity'
import { getWhatsAppProvider } from '@/integrations/whatsapp'

import type { WhatsAppLoginUsecaseDeps } from '../whatsapp_login.usecase'

export async function requestWhatsAppLogin(
  deps: WhatsAppLoginUsecaseDeps,
  req: Entity.RequestWhatsAppLoginReq,
): Promise<Entity.RequestWhatsAppLoginRes> {
  const user = await deps.userRepo.findByPhone(req.phone)
  const confirmToken = deps.generateConfirmToken()

  const row = await deps.repo.create({
    phone: req.phone,
    userId: user?.id ?? null,
    confirmToken,
    expiresAt: new Date(Date.now() + deps.requestTtlMs),
  })

  const devices = await getWhatsAppProvider().listDevices()
  const primary = devices.find((d) => d.isPrimary && d.isLoggedIn)
  if (!primary?.jid) {
    throw new AppError(
      ErrorCode.INTERNAL_ERROR,
      'Device WhatsApp utama belum terhubung — cek Settings > Koneksi WhatsApp',
    )
  }

  return {
    requestId: row.id,
    confirmMessage: `${deps.waLoginKeyword} ${confirmToken}`,
    businessWhatsapp: deps.jidToPhone(primary.jid),
  }
}
