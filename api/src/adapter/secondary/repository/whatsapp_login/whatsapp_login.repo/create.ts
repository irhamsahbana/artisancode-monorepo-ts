import { getExecutor } from '@/common/executor'
import { whatsappLoginRequests } from '@/db/schema'
import * as Entity from '@/entities/whatsapp_login.entity'

import type { WhatsAppLoginRepoDeps } from '../whatsapp_login.repo'

export async function createWhatsAppLoginRequest(
  deps: WhatsAppLoginRepoDeps,
  req: Entity.CreateWhatsAppLoginRequestReq,
): Promise<Entity.WhatsAppLoginRequestRow> {
  const [row] = await getExecutor()
    .insert(whatsappLoginRequests)
    .values({
      phone: req.phone,
      userId: req.userId,
      confirmToken: req.confirmToken,
      expiresAt: req.expiresAt,
    })
    .returning()
  return deps.toEntity(row)
}
