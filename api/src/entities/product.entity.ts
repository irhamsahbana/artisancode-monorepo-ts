import { PaginationMetadata, PaginationQuery } from './pagination.entity'

export interface Product {
  id: string
  name: string
  unit: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductReq {
  name: string
  unit: string
}

export interface UpdateProductReq {
  id: string
  name?: string
  unit?: string
  isActive?: boolean
}

export interface GetProductReq {
  q?: string
  isActive?: boolean
  pagination?: PaginationQuery
}

export interface ProductList {
  items: Product[]
  pagination: PaginationMetadata
}
