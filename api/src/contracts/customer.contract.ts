import * as Entity from '@/entities/customer.entity'

export interface ICustomerRepo {
  create(req: Entity.CreateCustomerReq): Promise<Entity.Customer>
  findById(id: string): Promise<Entity.Customer | null>
  findList(req: Entity.GetCustomerReq): Promise<Entity.CustomerList>
  update(req: Entity.UpdateCustomerReq): Promise<Entity.Customer | null>
  delete(id: string): Promise<void>
}

export interface ICustomerUsecase {
  create(req: Entity.CreateCustomerReq): Promise<Entity.Customer>
  findById(id: string): Promise<Entity.Customer | null>
  findList(req: Entity.GetCustomerReq): Promise<Entity.CustomerList>
  update(req: Entity.UpdateCustomerReq): Promise<Entity.Customer | null>
  delete(id: string): Promise<void>
}
