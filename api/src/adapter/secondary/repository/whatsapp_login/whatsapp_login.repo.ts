import { IWhatsAppLoginRepo } from '@/contracts/whatsapp_login.contract'
import { whatsappLoginRequests } from '@/db/schema'
import * as Entity from '@/entities/whatsapp_login.entity'

import { createWhatsAppLoginRequest } from './whatsapp_login.repo/create'
import { findWhatsAppLoginByConfirmToken } from './whatsapp_login.repo/find-by-confirm-token'
import { findWhatsAppLoginById } from './whatsapp_login.repo/find-by-id'
import { markWhatsAppLoginConsumed } from './whatsapp_login.repo/mark-consumed'
import { markWhatsAppLoginVerified } from './whatsapp_login.repo/mark-verified'

export interface WhatsAppLoginRepoDeps {
  toEntity: (data: typeof whatsappLoginRequests.$inferSelect) => Entity.WhatsAppLoginRequestRow
}

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
  const deps: WhatsAppLoginRepoDeps = { toEntity }

  return {
    create: (req) => createWhatsAppLoginRequest(deps, req),
    findById: (id) => findWhatsAppLoginById(deps, id),
    findByConfirmToken: (token) => findWhatsAppLoginByConfirmToken(deps, token),
    markVerified: (id) => markWhatsAppLoginVerified(deps, id),
    markConsumed: (id) => markWhatsAppLoginConsumed(deps, id),
  }
}

export default createWhatsAppLoginRepo
