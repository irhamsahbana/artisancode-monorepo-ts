import * as Entity from '@/entities/customer.entity'

export interface ICustomerRepo {
  create(req: Entity.CreateCustomerReq): Promise<Entity.Customer>
  /** Batch insert; resolves with the created customers in the same order as `reqs`. */
  createMany(reqs: Entity.CreateCustomerReq[]): Promise<Entity.Customer[]>
  findById(id: string): Promise<Entity.Customer | null>
  findList(req: Entity.GetCustomerReq): Promise<Entity.CustomerList>
  update(req: Entity.UpdateCustomerReq): Promise<Entity.Customer | null>
  delete(id: string): Promise<void>
  findCustomersByNames(names: string[]): Promise<Entity.Customer[]>
}

export interface ICustomerUsecase {
  create(req: Entity.CreateCustomerReq): Promise<Entity.Customer>
  findById(id: string): Promise<Entity.Customer | null>
  findList(req: Entity.GetCustomerReq): Promise<Entity.CustomerList>
  update(req: Entity.UpdateCustomerReq): Promise<Entity.Customer | null>
  delete(id: string): Promise<void>
  generateTemplate(): Promise<Buffer>
  dryRunImport(fileBuffer: Buffer | Uint8Array): Promise<Entity.CustomerImportDryRunResult>
  executeImport(req: Entity.CustomerImportExecuteReq): Promise<Entity.CustomerImportExecuteResult>
}
