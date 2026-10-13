import { describe, expect, it, mock } from 'bun:test'

const mockSendTextMessage = mock(async () => ({ messageId: 'msg-1' }))

mock.module('@/integrations/whatsapp', () => ({
  getWhatsAppProvider: () => ({
    sendTextMessage: mockSendTextMessage,
    listDevices: mock(async () => []),
  }),
}))

import { confirmByIncomingMessage } from '../whatsapp_login.usecase/confirm-by-incoming-message'
import { formatConfirmMessage } from '../whatsapp_login.usecase/helpers'

import type { WhatsAppLoginUsecaseDeps } from '../whatsapp_login.usecase'

describe('WhatsAppLogin Usecase - confirmByIncomingMessage & formatConfirmMessage', () => {
  it('should format confirm message with instruction', () => {
    const formatted = formatConfirmMessage('ABCD1234')
    expect(formatted).toBe('LOGIN ABCD1234. Kirim pesan ini tanpa mengubah isinya.')
  })

  it('should verify valid token from incoming message containing the instruction text', async () => {
    const mockRepo = {
      create: mock(async () => ({}) as any),
      findById: mock(async () => null),
      findByConfirmToken: mock(async (token: string) => {
        if (token === 'ABCD1234') {
          return {
            id: 'req-1',
            phone: '6281234567890',
            userId: 'user-1',
            confirmToken: 'ABCD1234',
            expiresAt: new Date(Date.now() + 60000),
            verifiedAt: null,
            consumedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }
        return null
      }),
      markVerified: mock(async () => ({}) as any),
      markConsumed: mock(async () => ({}) as any),
    }

    const deps: WhatsAppLoginUsecaseDeps = {
      repo: mockRepo,
      userRepo: {} as any,
    }

    await confirmByIncomingMessage(
      deps,
      '6281234567890',
      'LOGIN ABCD1234. Kirim pesan ini tanpa mengubah isinya.',
    )

    expect(mockRepo.findByConfirmToken).toHaveBeenCalledWith('ABCD1234')
    expect(mockRepo.markVerified).toHaveBeenCalledWith('req-1')
    expect(mockSendTextMessage).toHaveBeenCalledWith({
      to: '6281234567890',
      message: 'Login berhasil dikonfirmasi. Kembali ke halaman login untuk melanjutkan.',
    })
  })
})
