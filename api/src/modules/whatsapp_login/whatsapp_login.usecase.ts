import { toFullPhone } from '@artisancode/phone'
import { AppError, ErrorCode } from '@artisancode/types'

import { IBusinessProfileRepo } from '@/contracts/business_profile.contract'
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

export function createWhatsAppLoginUsecase(
  repo: IWhatsAppLoginRepo,
  userRepo: IUserRepo,
  businessProfileRepo: IBusinessProfileRepo,
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

      const profile = await businessProfileRepo.find()
      if (!profile?.phone) {
        throw new AppError(
          ErrorCode.INTERNAL_ERROR,
          'Nomor WhatsApp perusahaan belum diatur di Business Profile',
        )
      }

      return {
        requestId: row.id,
        confirmMessage: `${WA_LOGIN_KEYWORD} ${confirmToken}`,
        businessWhatsapp: toFullPhone(profile.countryCode, profile.phone),
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
