import * as Entity from '@/entities/whatsapp_login.entity'

export interface IWhatsAppLoginRepo {
  create(req: Entity.CreateWhatsAppLoginRequestReq): Promise<Entity.WhatsAppLoginRequestRow>
  findById(id: string): Promise<Entity.WhatsAppLoginRequestRow | null>
  findByConfirmToken(token: string): Promise<Entity.WhatsAppLoginRequestRow | null>
  markVerified(id: string): Promise<Entity.WhatsAppLoginRequestRow | null>
  markConsumed(id: string): Promise<Entity.WhatsAppLoginRequestRow | null>
}

export interface IWhatsAppLoginUsecase {
  request(req: Entity.RequestWhatsAppLoginReq): Promise<Entity.RequestWhatsAppLoginRes>
  getStatus(id: string): Promise<Entity.WhatsAppLoginStatusRes>
  /** Called by the whatsapp webhook when an inbound message arrives. */
  confirmByIncomingMessage(phone: string, messageBody: string): Promise<void>
}
