import { AppError, ErrorCode } from '@artisancode/types'

import { GowaIntegration } from '@/adapter/secondary/rest/gowa'
import { env } from '@/config/env'
import { IWhatsAppProvider } from '@/contracts/integration/whatsapp.contract'

const notApplicable = () =>
  new AppError(
    ErrorCode.NOT_IMPLEMENTED,
    'WHATSAPP_PROVIDER is "noop" — set it to "gowa" to connect a real device',
  )

/** Dev fallback: simulates a successful send without hitting any provider */
class NoopWhatsAppProvider implements IWhatsAppProvider {
  readonly name = 'noop'

  async sendTextMessage() {
    return { messageId: `noop-${crypto.randomUUID()}` }
  }

  async sendChatPresence() {
    return Promise.resolve()
  }

  async getConnectionStatus() {
    return { isConnected: true, isLoggedIn: true, jid: 'noop' }
  }

  login(): never {
    throw notApplicable()
  }

  logout(): never {
    throw notApplicable()
  }

  reconnect(): never {
    throw notApplicable()
  }
}

/**
 * Resolve the active WhatsApp provider from WHATSAPP_PROVIDER env.
 * 'noop' keeps the old simulate behavior for local dev without credentials.
 */
export function getWhatsAppProvider(): IWhatsAppProvider {
  switch (env.WHATSAPP.PROVIDER) {
    case 'gowa':
      return new GowaIntegration()
    default:
      return new NoopWhatsAppProvider()
  }
}
