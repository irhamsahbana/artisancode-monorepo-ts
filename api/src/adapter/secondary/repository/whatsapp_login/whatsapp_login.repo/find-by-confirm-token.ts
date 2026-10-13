import { eq } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { whatsappLoginRequests } from '@/db/schema'
import * as Entity from '@/entities/whatsapp_login.entity'

import type { WhatsAppLoginRepoDeps } from '../whatsapp_login.repo'

export async function findWhatsAppLoginByConfirmToken(
  deps: WhatsAppLoginRepoDeps,
  token: string,
): Promise<Entity.WhatsAppLoginRequestRow | null> {
  const [row] = await getExecutor()
    .select()
    .from(whatsappLoginRequests)
    .where(eq(whatsappLoginRequests.confirmToken, token))
    .limit(1)
  return row ? deps.toEntity(row) : null
}
