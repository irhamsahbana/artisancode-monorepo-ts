import { eq, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { whatsappLoginRequests } from '@/db/schema'
import * as Entity from '@/entities/whatsapp_login.entity'

import type { WhatsAppLoginRepoDeps } from '../whatsapp_login.repo'

export async function markWhatsAppLoginVerified(
  deps: WhatsAppLoginRepoDeps,
  id: string,
): Promise<Entity.WhatsAppLoginRequestRow | null> {
  const [row] = await getExecutor()
    .update(whatsappLoginRequests)
    .set({ verifiedAt: sql`now()`, updatedAt: sql`now()` })
    .where(eq(whatsappLoginRequests.id, id))
    .returning()
  return row ? deps.toEntity(row) : null
}
