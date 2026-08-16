import * as Entity from '@/entities/product.entity'

export interface IProductRepo {
  create(req: Entity.CreateProductReq): Promise<Entity.Product>
  findList(req: Entity.GetProductReq): Promise<Entity.ProductList>
  update(req: Entity.UpdateProductReq): Promise<Entity.Product | null>
}

export interface IProductUsecase {
  create(req: Entity.CreateProductReq): Promise<Entity.Product>
  findList(req: Entity.GetProductReq): Promise<Entity.ProductList>
  update(req: Entity.UpdateProductReq): Promise<Entity.Product>
}
