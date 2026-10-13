import { AppError, ErrorCode } from '@artisancode/types'

import * as Entity from '@/entities/whatsapp_login.entity'
import { issueSession } from '@/modules/user/user.usecase/issue-session'

import type { WhatsAppLoginUsecaseDeps } from '../whatsapp_login.usecase'

export async function getWhatsAppLoginStatus(
  deps: WhatsAppLoginUsecaseDeps,
  id: string,
): Promise<Entity.WhatsAppLoginStatusRes> {
  const row = await deps.repo.findById(id)
  if (!row) throw new AppError(ErrorCode.NOT_FOUND, 'Permintaan login tidak ditemukan')

  if (!row.verifiedAt) return { pending: true }
  if (row.consumedAt) return { pending: false }
  if (!row.userId) return { pending: false }

  const user = await deps.userRepo.findById(row.userId)
  if (!user) return { pending: false }

  // Mark consumed before issuing so a second poll never re-issues a session.
  await deps.repo.markConsumed(row.id)
  const login = await issueSession(user)
  return { pending: false, login }
}
