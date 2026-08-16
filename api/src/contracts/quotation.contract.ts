import * as Entity from '@/entities/quotation.entity'

export interface IQuotationRepo {
  create(req: Entity.CreateQuotationReq): Promise<Entity.QuotationRequest>
  findById(id: string): Promise<Entity.QuotationRequest | null>
  findList(page: number, perPage: number): Promise<Entity.QuotationList>
  updateStatus(id: string, status: Entity.QuotationStatus): Promise<Entity.QuotationRequest | null>
  assignProject(req: Entity.AssignQuotationReq): Promise<Entity.QuotationRequest | null>
}

export interface IQuotationUsecase {
  create(req: Entity.CreateQuotationReq): Promise<Entity.QuotationRequest>
  findById(id: string): Promise<Entity.QuotationRequest>
  findList(page: number, perPage: number): Promise<Entity.QuotationList>
  updateStatus(req: Entity.UpdateQuotationStatusReq): Promise<Entity.QuotationRequest>
  assignProject(req: Entity.AssignQuotationReq): Promise<Entity.QuotationRequest>
}
