import { getWhatsAppProvider } from '@/integrations/whatsapp'

import { CONFIRM_MESSAGE_PATTERN } from './helpers'

import type { WhatsAppLoginUsecaseDeps } from '../whatsapp_login.usecase'

export async function confirmByIncomingMessage(
  deps: WhatsAppLoginUsecaseDeps,
  phone: string,
  messageBody: string,
): Promise<void> {
  const match = messageBody.match(CONFIRM_MESSAGE_PATTERN)
  if (!match) return

  const token = match[1]?.toUpperCase()
  if (!token) return

  const existing = await deps.repo.findByConfirmToken(token)
  if (!existing || existing.verifiedAt || existing.phone !== phone || existing.userId === null)
    return
  if (existing.expiresAt.getTime() < Date.now()) return

  await deps.repo.markVerified(existing.id)
  await getWhatsAppProvider().sendTextMessage({
    to: phone,
    message: 'Login berhasil dikonfirmasi. Kembali ke halaman login untuk melanjutkan.',
  })
}

export { confirmByIncomingMessage as confirmWhatsAppLoginByIncomingMessage }
