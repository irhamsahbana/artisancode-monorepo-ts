import { eq, sql } from 'drizzle-orm'

import { getExecutor } from '@/common/executor'
import { IWhatsAppLoginRepo } from '@/contracts/whatsapp_login.contract'
import { whatsappLoginRequests } from '@/db/schema'
import * as Entity from '@/entities/whatsapp_login.entity'

function toEntity(data: typeof whatsappLoginRequests.$inferSelect): Entity.WhatsAppLoginRequestRow {
  return {
    id: data.id,
    phone: data.phone,
    userId: data.userId,
    confirmToken: data.confirmToken,
    expiresAt: data.expiresAt,
    verifiedAt: data.verifiedAt,
    consumedAt: data.consumedAt,
    createdAt: data.createdAt,
  }
}

export function createWhatsAppLoginRepo(): IWhatsAppLoginRepo {
  return {
    create: async (req) => {
      const [row] = await getExecutor()
        .insert(whatsappLoginRequests)
        .values({
          phone: req.phone,
          userId: req.userId,
          confirmToken: req.confirmToken,
          expiresAt: req.expiresAt,
        })
        .returning()
      return toEntity(row)
    },

    findById: async (id) => {
      const [row] = await getExecutor()
        .select()
        .from(whatsappLoginRequests)
        .where(eq(whatsappLoginRequests.id, id))
        .limit(1)
      return row ? toEntity(row) : null
    },

    findByConfirmToken: async (token) => {
      const [row] = await getExecutor()
        .select()
        .from(whatsappLoginRequests)
        .where(eq(whatsappLoginRequests.confirmToken, token))
        .limit(1)
      return row ? toEntity(row) : null
    },

    markVerified: async (id) => {
      const [row] = await getExecutor()
        .update(whatsappLoginRequests)
        .set({ verifiedAt: sql`now()`, updatedAt: sql`now()` })
        .where(eq(whatsappLoginRequests.id, id))
        .returning()
      return row ? toEntity(row) : null
    },

    markConsumed: async (id) => {
      const [row] = await getExecutor()
        .update(whatsappLoginRequests)
        .set({ consumedAt: sql`now()`, updatedAt: sql`now()` })
        .where(eq(whatsappLoginRequests.id, id))
        .returning()
      return row ? toEntity(row) : null
    },
  }
}

export default createWhatsAppLoginRepo
