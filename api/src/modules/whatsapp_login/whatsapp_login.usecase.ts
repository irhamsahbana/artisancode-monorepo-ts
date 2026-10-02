import { AppError, ErrorCode } from '@artisancode/types'

import { IUserRepo } from '@/contracts/user.contract'
import { IWhatsAppLoginRepo, IWhatsAppLoginUsecase } from '@/contracts/whatsapp_login.contract'
import { getWhatsAppProvider } from '@/integrations/whatsapp'
import { issueSession } from '@/modules/user/user.usecase/issue-session'

export const WA_LOGIN_KEYWORD = 'LOGIN'
const CONFIRM_MESSAGE_PATTERN = /LOGIN\s+([A-Z0-9]{6,12})/i
const REQUEST_TTL_MS = 5 * 60 * 1000

function generateConfirmToken(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
}

/** "6281234567890@s.whatsapp.net" (or "...:1@s.whatsapp.net") -> "6281234567890" */
function jidToPhone(jid: string): string {
  return jid.split('@')[0]?.split(':')[0] ?? ''
}

export function createWhatsAppLoginUsecase(
  repo: IWhatsAppLoginRepo,
  userRepo: IUserRepo,
): IWhatsAppLoginUsecase {
  return {
    request: async (req) => {
      const user = await userRepo.findByPhone(req.phone)
      const confirmToken = generateConfirmToken()
      // Always creates a row and returns the same success shape whether or
      // not the phone matches a user — never reveal via the response which
      // phone numbers are registered.
      const row = await repo.create({
        phone: req.phone,
        userId: user?.id ?? null,
        confirmToken,
        expiresAt: new Date(Date.now() + REQUEST_TTL_MS),
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
        confirmMessage: `${WA_LOGIN_KEYWORD} ${confirmToken}`,
        businessWhatsapp: jidToPhone(primary.jid),
      }
    },

    getStatus: async (id) => {
      const row = await repo.findById(id)
      if (!row) throw new AppError(ErrorCode.NOT_FOUND, 'Permintaan login tidak ditemukan')

      if (!row.verifiedAt) return { pending: true }
      if (row.consumedAt) return { pending: false }
      if (!row.userId) return { pending: false }

      const user = await userRepo.findById(row.userId)
      if (!user) return { pending: false }

      // Mark consumed before issuing so a second poll never re-issues a session.
      await repo.markConsumed(row.id)
      const login = await issueSession(user)
      return { pending: false, login }
    },

    confirmByIncomingMessage: async (phone, messageBody) => {
      const match = messageBody.match(CONFIRM_MESSAGE_PATTERN)
      if (!match) return

      const token = match[1]?.toUpperCase()
      if (!token) return

      const existing = await repo.findByConfirmToken(token)
      if (!existing || existing.verifiedAt || existing.phone !== phone || existing.userId === null)
        return
      if (existing.expiresAt.getTime() < Date.now()) return

      await repo.markVerified(existing.id)
      await getWhatsAppProvider().sendTextMessage({
        to: phone,
        message: 'Login berhasil dikonfirmasi. Kembali ke halaman login untuk melanjutkan.',
      })
    },
  }
}

export default createWhatsAppLoginUsecase
