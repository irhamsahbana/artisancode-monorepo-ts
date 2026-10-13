import { IProductRepo } from '@/contracts/product.contract'
import { products } from '@/db/schema'
import * as Entity from '@/entities/product.entity'

import { createProduct } from './product.repo/create'
import { deleteProduct } from './product.repo/delete'
import { findProductList } from './product.repo/find-list'
import { updateProduct } from './product.repo/update'

export interface ProductRepoDeps {
  toEntity: (data: typeof products.$inferSelect) => Entity.Product
}

function toEntity(data: typeof products.$inferSelect): Entity.Product {
  return {
    id: data.id,
    name: data.name,
    unit: data.unit,
    isActive: data.status === 'active',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export function createProductRepo(): IProductRepo {
  const deps: ProductRepoDeps = { toEntity }

  return {
    create: (req) => createProduct(deps, req),
    findList: (req) => findProductList(deps, req),
    update: (req) => updateProduct(deps, req),
    delete: (id) => deleteProduct(id),
  }
}

export default createProductRepo
