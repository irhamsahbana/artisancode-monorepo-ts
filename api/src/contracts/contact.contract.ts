import * as Entity from '@/entities/contact.entity'

export interface IContactRepo {
  create(req: Entity.CreateContactReq): Promise<Entity.Contact>
  findById(id: string): Promise<Entity.Contact | null>
  findList(req: Entity.GetContactReq): Promise<Entity.ContactList>
  update(req: Entity.UpdateContactReq): Promise<Entity.Contact | null>
  delete(id: string): Promise<void>
}

export interface IContactUsecase {
  create(req: Entity.CreateContactReq): Promise<Entity.Contact>
  findById(id: string): Promise<Entity.Contact | null>
  findList(req: Entity.GetContactReq): Promise<Entity.ContactList>
  update(req: Entity.UpdateContactReq): Promise<Entity.Contact | null>
  delete(id: string): Promise<void>
}
