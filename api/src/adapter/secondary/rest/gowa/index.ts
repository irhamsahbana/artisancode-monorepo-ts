import {
  IWhatsAppProvider,
  SendWhatsAppTextReq,
  SendWhatsAppTextRes,
} from '@/contracts/integration/whatsapp.contract'

import { createGowaClientConfig, GowaClientConfig } from './client'
import { sendMessage } from './send-message'

export class GowaIntegration implements IWhatsAppProvider {
  readonly name = 'gowa'
  private config: GowaClientConfig

  constructor() {
    this.config = createGowaClientConfig()
  }

  sendTextMessage(req: SendWhatsAppTextReq): Promise<SendWhatsAppTextRes> {
    return sendMessage(this.config, req)
  }
}
